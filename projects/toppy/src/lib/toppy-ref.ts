import { animationFrameScheduler, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, observeOn, skipWhile, takeUntil, tap } from 'rxjs/operators';
import { EventBus } from './helper/event-bus';
import { HostContainer } from './host-container';
import { ToppyConfig } from './models';
import { OverlayInstance } from './overlay-instance';
import { getContentMeta } from './utils';

export class ToppyRef {
  private _isOpen = false;
  private _alive: Subject<Boolean> = new Subject();
  private _listenDocumentEvents = true;

  constructor(
    private _overlay: OverlayInstance,
    private _host: HostContainer,
    private _eventBus: EventBus,
    private _config: ToppyConfig,
    public overlayID: string
  ) {}

  open() {
    if (this._isOpen) {
      return;
    }
    const view = this._host.attach();
    this._overlay.create().setView(view);
    if (this._listenDocumentEvents) {
      this.onDocumentClick().subscribe();
      this.onWindowResize().subscribe();
    }
    setTimeout(_ => this._overlay.computePosition.next(true), 1);
    this._isOpen = true;
    return this;
  }

  close() {
    this._host.detach();
    this._overlay.destroy();
    this._cleanup();
    this._isOpen = false;
    this._eventBus.post({ name: 'REMOVE_OVERLAY_INS', data: this.overlayID });
  }

  toggle() {
    return this._isOpen ? this.close() : this.open();
  }

  events() {
    return this._eventBus.watch();
  }

  onDocumentClick(): Observable<any> {
    return fromEvent(this._overlay.getContainerEl(), 'click').pipe(
      takeUntil(this._alive),
      map((e: any) => e.target),
      skipWhile(() => !this._config.dismissOnDocumentClick),
      filter(this._overlay.isHostElement.bind(this._overlay)),
      tap(_ => this._config.docClickCallback.call(null)),
      tap(() => this.close())
    );
  }

  onWindowResize(): Observable<any> {
    const onResize = fromEvent(window, 'resize');
    const onScroll = fromEvent(window, 'scroll', { passive: true });
    return merge(onResize, onScroll).pipe(
      takeUntil(this._alive),
      debounceTime(5),
      observeOn(animationFrameScheduler),
      distinctUntilChanged(),
      tap(() => {
        this._overlay.computePosition.next(true);
        this._overlay.config.windowResizeCallback();
      })
    );
  }

  getConfig() {
    return this._config;
  }

  updateHost(content, props = {}) {
    const data = getContentMeta(content, props, this.overlayID);
    this._host.configure(data);
    return this;
  }

  updatePosition(positionConfig) {
    this._overlay.updatePositionConfig(positionConfig);
  }

  private _cleanup() {
    this._alive.next(true);
  }
}
