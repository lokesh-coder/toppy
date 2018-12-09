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
import { HostArgs, ToppyConfig } from './models';
import { Position } from './position/position';
import { ToppyComponent } from './toppy.component';
import { getContentMeta, _fire } from './utils';

export class ToppyControl {
  position: Position;
  config: ToppyConfig;
  content: HostArgs;
  tid: string;
  comp: ToppyComponent;
  private _viewEl: HTMLElement;
  private _isOpen = false;
  private _listenBrowserEvents = true;
  private _compFac: ComponentFactory<ToppyComponent>;
  private _alive: Subject<Boolean> = new Subject();
  updateTextContent: Subject<string> = new Subject();
  hostView: ViewRef;
  compRef: ComponentRef<ToppyComponent>;
  constructor(
    private appRef: ApplicationRef,
    private compResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {
    this.updateTextContent.subscribe(content => {
      if (this._isOpen) {
        this.comp.updateTextContent(content);
      }
    });
  }

  open() {
    if (this._isOpen) {
      return;
    }
    this._attach();
    if (this._viewEl && this._listenBrowserEvents) {
      mergeObs(this.onDocumentClick(), this.onWindowResize(), this.onEscClick()).subscribe(_ => {
        console.log('d', _);
      });
    }
    setTimeout(_ => {
      this.comp.triggerPosChange.next(true);
    }, 1);
    _fire({ name: 'OPENED_OVERLAY_INS', data: this.tid });
    this._isOpen = true;
    return this;
  }
  close() {
    this._dettach();
    _fire({ name: 'REMOVED_OVERLAY_INS', data: this.tid });
    this._alive.next(true);
    this._isOpen = false;
  }
  toggle() {
    return this._isOpen ? this.close() : this.open();
  }
  onEscClick() {
    return fromEvent(document.getElementsByTagName('body'), 'keydown').pipe(
      takeUntil(this._alive),
      skipWhile(() => !this.config.closeOnEsc),
      filter((e: any) => (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) && e.target.nodeName === 'BODY'),
      tap(e => e.preventDefault()),
      map((e: any) => e.target),
      tap(() => this.close())
    );
  }

  onDocumentClick(): Observable<any> {
    return fromEvent(this._viewEl, 'click').pipe(
      takeUntil(this._alive),
      map((e: any) => e.target),
      skipWhile(() => !this.config.dismissOnDocumentClick),
      filter(this.isNotHostElement.bind(this)),
      tap(_ => this.config.docClickCallback.call(null)),
      tap(() => this.close())
    );
  }

  onWindowResize(): Observable<any> {
    const onResize = fromEvent(window, 'resize');
    const onScroll = fromEvent(window, 'scroll', { passive: true });
    return mergeObs(onResize, onScroll).pipe(
      takeUntil(this._alive),
      debounceTime(5),
      observeOn(animationFrameScheduler),
      distinctUntilChanged(),
      tap(() => {
        this.comp.triggerPosChange.next(true);
        this.config.windowResizeCallback();
      })
    );
  }

  changePosition(newPosition) {
    this.position = newPosition;
  }

  updatePosition(positionConfig) {
    this.position.updateConfig(positionConfig);
  }

  updateHost(content, props = {}) {
    this.content = getContentMeta(content, { ...this.content.props, ...props });
    return this;
  }

  private isNotHostElement(el): boolean {
    const wrapperEl = this._viewEl.querySelector('.t-wrapper');
    return el !== wrapperEl && !wrapperEl.contains(el);
  }

  private _attach() {
    this._compFac = this.compResolver.resolveComponentFactory(ToppyComponent);
    this.compRef = this._compFac.create(this.injector);
    this.comp = this.compRef.instance;
    const { position, content, config, tid } = this;
    content.props.close = this.close.bind(this);
    Object.assign(this.comp, { position, content, config, tid });
    this.hostView = this.compRef.hostView;
    this.appRef.attachView(this.hostView);
    this._viewEl = (this.hostView as any).rootNodes[0];
    document.getElementsByTagName('body')[0].appendChild(this._viewEl);
    return this._viewEl;
  }

  private _dettach() {
    if (!this.hostView) {
      return;
    }
    this.appRef.detachView(this.hostView);
    this.compRef.destroy();
    this.hostView = this._viewEl = this.comp = null;
  }
}
