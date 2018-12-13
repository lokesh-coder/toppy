import {
  ApplicationRef,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Injector,
  ViewRef
} from '@angular/core';
import { animationFrameScheduler, fromEvent, merge as mergeObs, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, observeOn, skipWhile, takeUntil, tap } from 'rxjs/operators';
import { Content, ContentData, ContentProps, ToppyConfig } from './models';
import { Position } from './position/position';
import { ToppyComponent } from './toppy.component';
import { Bus, getContent } from './utils';

export class ToppyControl {
  position: Position;
  config: ToppyConfig;
  content: Content;
  tid: string;
  comp: ToppyComponent;
  updateTextContent: Subject<string> = new Subject();
  hostView: ViewRef;
  compRef: ComponentRef<ToppyComponent>;

  private viewEl: HTMLElement;
  private isOpen = false;
  private listenBrowserEvents = true;
  private compFac: ComponentFactory<ToppyComponent>;
  private die: Subject<1> = new Subject();

  constructor(
    private appRef: ApplicationRef,
    private compResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {
    this.updateTextContent.subscribe(content => {
      if (this.isOpen) this.comp.updateTextContent(content);
    });
  }

  open(): void {
    if (this.isOpen) return;

    this.attach();
    if (this.viewEl && this.listenBrowserEvents) {
      mergeObs(this.onDocumentClick(), this.onWindowResize(), this.onEscClick()).subscribe();
      setTimeout(() => this.comp && this.comp.triggerPosChange.next(1), 1);
    }

    Bus.send(this.tid, 't_open');
    this.isOpen = true;
  }

  close(): void {
    this.dettach();
    this.die.next(1);
    Bus.send(this.tid, 't_close');
    this.isOpen = false;
  }

  toggle(): void {
    return this.isOpen ? this.close() : this.open();
  }

  onEscClick(): Observable<any> {
    return fromEvent(document.getElementsByTagName('body'), 'keydown').pipe(
      takeUntil(this.die),
      skipWhile(() => !this.config.closeOnEsc),
      filter((e: any) => (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) && e.target.nodeName === 'BODY'),
      tap(e => e.preventDefault()),
      map((e: any) => e.target),
      tap(() => this.close())
    );
  }

  onDocumentClick(): Observable<any> {
    return fromEvent(this.viewEl, 'click').pipe(
      takeUntil(this.die),
      map((e: any) => e.target),
      skipWhile(() => !this.config.closeOnDocClick),
      filter(this.isNotHostElement.bind(this)),
      tap(() => {
        this.config.docClickCallback();
        this.close();
      })
    );
  }

  onWindowResize(): Observable<any> {
    const onResize = fromEvent(window, 'resize');
    const onScroll = fromEvent(window, 'scroll', { passive: true });
    return mergeObs(onResize, onScroll).pipe(
      skipWhile(() => !this.config.listenWindowEvents),
      takeUntil(this.die),
      debounceTime(5),
      observeOn(animationFrameScheduler),
      distinctUntilChanged(),
      tap(() => {
        // tslint:disable-next-line:no-unused-expression
        this.comp && this.comp.triggerPosChange.next(1);
        this.config.windowResizeCallback();
      })
    );
  }

  changePosition(newPosition: Position): void {
    this.position = newPosition;
  }

  updatePosition(positionConfig: any): void {
    this.position.updateConfig(positionConfig);
  }

  updateContent(content: ContentData, props: ContentProps = {}): void {
    this.content = getContent(content, { ...this.content.props, ...props });
  }

  listen(eventName: string) {
    return Bus.listen(this.tid, eventName);
  }

  private isNotHostElement(el): boolean {
    const wrapperEl = this.viewEl.querySelector('.t-wrapper');
    return el !== wrapperEl && !wrapperEl.contains(el);
  }

  private attach(): void {
    /* create component */
    this.compFac = this.compResolver.resolveComponentFactory(ToppyComponent);
    this.compRef = this.compFac.create(this.injector);
    this.comp = this.compRef.instance;

    /* assign props */
    const { position, content, config, tid } = this;
    content.props.close = this.close.bind(this);
    Object.assign(this.comp, { position, content, config, tid });

    /* attach view */
    this.hostView = this.compRef.hostView;
    this.appRef.attachView(this.hostView);
    this.viewEl = (this.hostView as any).rootNodes[0];
    document.querySelector('body').appendChild(this.viewEl);
  }

  private dettach(): void {
    if (!this.hostView) return;

    this.appRef.detachView(this.hostView);
    this.compRef.destroy();
    this.hostView = this.viewEl = this.comp = null;
  }
}
