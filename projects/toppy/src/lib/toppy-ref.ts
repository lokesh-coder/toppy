import { Injectable } from '@angular/core';
import { HostContainer } from './host-container';
import { OverlayInstance } from './overlay-instance';
import { Messenger } from './helper/messenger';
import { fromEvent, Observable } from 'rxjs';
import { map, filter, observeOn, distinctUntilChanged, debounceTime, takeUntil, tap, skipWhile } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ComponentInstance } from './component-ins';
import { animationFrameScheduler } from 'rxjs';
import { merge } from 'rxjs';
import { OverlayConfig } from './overlay-config';

export class ToppyRef<C> {
  compIns: ComponentInstance<C>;
  events = {};
  private _isOpen = false;
  private _alive: Subject<any> = new Subject();

  constructor(
    private _overlay: OverlayInstance,
    private _host: HostContainer<C>,
    private _messenger: Messenger,
    private _config: OverlayConfig,
    public id: string
  ) {
    this._addEvent('overlay', this._overlay);
  }

  open() {
    if (this.compIns) {
      this.close();
    }
    const view = this._host.attach();
    this._overlay.create().setView(view);
    // this.compIns = this._host.getCompIns();

    // const comp = this.compIns.component as any;
    // this._addEvent(comp.constructor.name, comp);

    this.onDocumentClick().subscribe();
    this.onWindowResize().subscribe();

    setTimeout(_ => this._overlay.computePosition.next(true), 1);
    this._isOpen = true;
    return this;
  }

  close() {
    this._host.detach();
    this._overlay.destroy();
    // this._messenger.post({ name: 'REMOVE_OVERLAY_INS', data: this.id });
    this._cleanup();
    this._isOpen = false;
  }

  toggle() {
    return this._isOpen ? this.close() : this.open();
  }

  onDocumentClick(): Observable<any> {
    return fromEvent(this._overlay.containerEl, 'click').pipe(
      takeUntil(this._alive),
      map((e: any) => e.target),
      skipWhile(() => !this._config.dismissOnDocumentClick),
      filter(this._overlay.isHostContainerElement.bind(this._overlay)),
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

  private _addEvent(name, type) {
    if (type.events) {
      this.events[name] = type.events.asObservable().pipe(takeUntil(this._alive));
    }
  }

  private _cleanup() {
    this._alive.next(true);
  }
}
