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
  el: HTMLElement|any;
  wrapperEl: HTMLElement|any;
  triggerPosChange: Subject<boolean> = new Subject();
  private _alive: Subject<1> = new Subject();

  constructor(private _inj: Injector, private cd: ChangeDetectorRef, private elRef: ElementRef) {}

  ngOnInit() {
   this.el = this.elRef.nativeElement;
   this.wrapperEl = this.el.querySelector('.t-wrapper');
    let cls = [this.config.containerClass, this.position.getClassName()];
    if (this.config.dismissOnDocumentClick) {
      cls = cls.concat(['no-pointers']);
    }
    this.el.setAttribute('data-tid', this.tid);
    cssClass('add', cls, `[data-tid=${[this.tid]}]`);
    cssClass('add', [this.config.bodyClassNameOnOpen]);
    this.triggerPosChange.pipe(takeUntil(this._alive)).subscribe(() => this.setPos(true));
  }

  ngAfterViewInit() {
    this.setPos(true);
    this.listenPos();
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
    cssClass('remove', [this.config.bodyClassNameOnOpen]);
    Bus.send(this.tid, 'DETACHED');
    this._alive.next(1);
  }

  private listenPos() {
    Bus.listen(this.tid, 'NEW_DYN_POS')
      .pipe(takeUntil(this._alive))
      .subscribe(e => {
        if (!e) return this.setPos(true);
        const coords = { left: e.x, top: e.y };
        this.wrapperEl.style = toCss(coords);
      });
  }

  private setPos(show = false): void {
    const coords = this.position.getPositions(this.wrapperEl);
    if (show) {
      Object.assign(coords, {visibility: 'visible', opacity: '1'});
    }

    this.wrapperEl.style = toCss(coords);
    Bus.send(this.tid, 'T_POSUPDATE');
  }

}
