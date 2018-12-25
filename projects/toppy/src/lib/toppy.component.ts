import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { Content, ContentType, TID, ToppyConfig } from './models';
import { ToppyPosition } from './position/position';
import { ToppyOverlay } from './toppy-overlay';
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
  position: ToppyPosition;
  tid: TID;
  el: HTMLElement | any;
  wrapperEl: HTMLElement | any;
  extra: string;
  overlayInj: Injector = null;
  private die: Subject<1> = new Subject();

  constructor(private inj: Injector, private cd: ChangeDetectorRef, private elRef: ElementRef) {}

  ngOnInit() {
    this.el = this.elRef.nativeElement;
    this.wrapperEl = this.el.querySelector('.t-wrapper');
    let cls = ['t-container', this.config.containerClass, this.position.getClassName()];
    if (this.config.closeOnDocClick) {
      cls = cls.concat(['no-pointers']);
    }
    this.el.setAttribute('data-tid', this.tid);
    cssClass('add', cls, `[data-tid='${[this.tid]}']`);
    cssClass('add', [this.config.bodyClass]);
  }

  ngAfterViewInit() {
    this.listenPos().subscribe();
  }

  get createInj(): Injector {
    this.overlayInj = newInjector(
      {
        provide: ToppyOverlay,
        useFactory: () => new ToppyOverlay(this.content.props),
        deps: []
      },
      this.inj
    );
    return this.overlayInj;
  }

  updateTextContent(data: string): void {
    if (this.content.type === ContentType.STRING) {
      this.content.data = data;
      this.cd.detectChanges();
    }
  }

  ngOnDestroy(): void {
    cssClass('remove', [this.config.bodyClass]);
    this.die.next(1);
    Bus.send(this.tid, 't_detach');
  }

  private listenPos(): Observable<any> {
    return Bus.listen(this.tid, 't_dynpos').pipe(
      startWith(1),
      takeUntil(this.die),
      tap(e => {
        if (!e || !e.x) return this.setPos();
        const coords = { left: e.x, top: e.y };
        this.wrapperEl.style = toCss(coords);
      })
    );
  }

  private setPos(): void {
    const { extra, ...coords } = this.position.getPositions(this.wrapperEl);
    if (this.extra !== extra) {
      this.extra = extra;
      this.cd.detectChanges();
    }
    Object.assign(coords, { visibility: 'visible', opacity: '1' });
    this.wrapperEl.style = toCss(coords);
    Bus.send(this.tid, 't_posupdate');
  }
}
