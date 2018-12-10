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
import { takeUntil } from 'rxjs/operators';
import { CurrentOverlay } from './current-overlay';
import { Content, ContentType, ToppyConfig } from './models';
import { Position } from './position/position';
import { Bus, cssClass, newInjector, toCss } from './utils';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'toppy',
  templateUrl: './template.html',
  styleUrls: ['./styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToppyComponent implements OnInit, AfterViewInit, OnDestroy {
  content: Content = {
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
    cssClass('add', this.config.bodyClassNameOnOpen);
    this._applyCoords();
  }

  ngAfterViewInit() {
    this._setPosition(true);
    this._watchPositionChange();
  }

  createInj() {
    return newInjector(
      {
        provide: CurrentOverlay,
        useFactory: () => new CurrentOverlay(this.content.props.close),
        deps: []
      },
      this._inj
    );
  }

  updateTextContent(newData) {
    if (this.content.type === ContentType.STRING) {
      this.content.data = newData;
      this.cd.detectChanges();
    }
  }

  ngOnDestroy() {
    cssClass('remove', this.config.bodyClassNameOnOpen);
    Bus.send(this.tid, 'DETACHED');
    this._alive.next(false);
  }

  private _watchPositionChange() {
    Bus.listen(this.tid, 'NEW_DYN_POS')
      .pipe(takeUntil(this._alive))
      .subscribe(e => {
        if (!e) return this._setPosition(true);
        const coords = { left: e.x, top: e.y };
        this.wrapperEl.nativeElement.style = toCss(coords);
      });
  }

  private _setPosition(show = false): void {
    const el = this.wrapperEl.nativeElement;
    let coords = this.position.getPositions(el);
    if (show) {
      coords = { ...coords, visibility: 'visible', opacity: '1' };
    }
    el.style = toCss(coords);
    Bus.send(this.tid, 'T_POSUPDATE');
  }

  private _applyCoords(): void {
    this.triggerPosChange.pipe(takeUntil(this._alive)).subscribe(_ => {
      this._setPosition(true);
    });
  }
}
