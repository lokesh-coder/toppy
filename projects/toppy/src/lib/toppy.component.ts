import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { CurrentOverlay } from './current-overlay';
import { ContentType, HostArgs, ToppyConfig } from './models';
import { Position } from './position/position';
import { addClassNameToBody, removeClassNameFromBody, toCss, _fire, _on } from './utils';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'toppy',
  templateUrl: './template.html',
  styleUrls: ['./styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToppyComponent implements OnInit, AfterViewInit, OnDestroy {
  content: HostArgs = {
    type: ContentType.STRING,
    data: '',
    props: {}
  };
  config: ToppyConfig;
  position: Position;
  toppyRef;
  close;
  tid;
  @ViewChild('wrapperEl', { read: ElementRef }) wrapperEl: ElementRef;
  @HostBinding('attr.data-tid') id;
  @HostBinding('class') className;
  triggerPosChange: Subject<boolean> = new Subject();
  private _alive: Subject<Boolean> = new Subject();

  constructor(private _inj: Injector, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.id = this.tid;
    this.className = `${this.config.containerClass} ${this.position.getClassName()}`;
    if (this.config.dismissOnDocumentClick) {
      this.className += ' no-pointers';
    }
    addClassNameToBody(this.config.bodyClassNameOnOpen);
    this._applyCoords();
  }

  ngAfterViewInit() {
    this._setPosition(true);
    this._watchPositionChange();
  }

  createInj() {
    return Injector.create({
      providers: [
        {
          provide: CurrentOverlay,
          useFactory: () => new CurrentOverlay(this.content.props.close),
          deps: []
        }
      ],
      parent: this._inj
    });
  }

  updateTextContent(newData) {
    if (this.content.type === ContentType.STRING) {
      this.content.data = newData;
      this.cd.detectChanges();
    }
  }

  ngOnDestroy() {
    removeClassNameFromBody(this.config.bodyClassNameOnOpen);
    _fire({ name: 'DETACHED', data: null });
    this._alive.next(false);
  }

  private _watchPositionChange() {
    _on()
      .pipe(
        filter(data => data.name === 'NEW_DYN_POS'),
        map(d => d.data),
        takeUntil(this._alive)
      )
      .subscribe(e => {
        if (!e) {
          return this._setPosition(true);
        }
        const el = this.wrapperEl.nativeElement;
        const coords = { left: e.x, top: e.y };
        el.style = toCss(coords);
      });
  }

  private _setPosition(show = false): void {
    const el = this.wrapperEl.nativeElement;
    let coords = this.position.getPositions(el);
    if (show) {
      coords = { ...coords, visibility: 'visible', opacity: '1' };
    }
    el.style = toCss(coords);
    _fire({ name: 'T_POSUPDATE' });
  }

  private _applyCoords(): void {
    this.triggerPosChange.pipe(takeUntil(this._alive)).subscribe(_ => {
      this._setPosition(true);
    });
  }
}
