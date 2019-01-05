import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { Content, ContentType, TID, ToppyConfig } from './models';
import { ToppyPosition } from './position/position';
import { Bus, cssClass, toCss } from './utils';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'toppy',
  templateUrl: './template.html',
  styleUrls: ['./styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToppyComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('compOutlet', { read: ViewContainerRef }) compOutlet: ViewContainerRef;
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
  pinj: any;
  compInstance;
  private die: Subject<1> = new Subject();

  constructor(
    public inj: Injector,
    private cd: ChangeDetectorRef,
    private compResolver: ComponentFactoryResolver,
    private elRef: ElementRef
  ) {
    this.pinj = Injector;
  }

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
    if (this.content.type === ContentType.COMPONENT) {
      this.compInstance = this.setComponent(this.content.props);
      Bus.send(this.tid, 't_compins', this.compInstance);
    }
  }

  setComponent(props) {
    const compRef = this.compOutlet.createComponent(
      this.compResolver.resolveComponentFactory(this.content.data as any)
    );
    Object.assign(compRef.instance, props);
    compRef.changeDetectorRef.detectChanges();
    return compRef.instance;
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
