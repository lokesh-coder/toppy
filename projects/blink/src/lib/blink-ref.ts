import { Injectable } from '@angular/core';
import { ComponentHost } from './host';
import { OverlayInstance } from './overlay-ins';
import { Messenger } from './helper/messenger';
import { fromEvent, Observable } from 'rxjs';
import { map, filter, observeOn, distinctUntilChanged, debounceTime, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ComponentInstance } from './component-ins';
import { animationFrameScheduler } from 'rxjs';
import { merge } from 'rxjs';

// @Injectable()
export class BlinkRef<C> {
  static c = 0;
  compIns: ComponentInstance<C>;
  events = {};
  config;
  count = 0;
  private alive: Subject<any> = new Subject();
  constructor(
    private _overlay: OverlayInstance,
    private _host: ComponentHost<C>,
    private _messenger: Messenger,
    public id: string
  ) {
    this.addEvent('overlay', this._overlay);
    this.count++;
    console.log('sparkle ref initiated ==>', this.count);
  }

  open() {
    // close existing overlays
    if (this.compIns) {
      this.close();
    }
    const view = this._host.attach().componentView();
    this._overlay.create().setView(view);
    this.compIns = this._host.getCompIns();
    const comp = this.compIns.component as any;
    this.addEvent(comp.constructor.name, comp);
    this.onDocumentClick().subscribe(() => {
      console.log('clicked docuemnt');
    });
    this.onWindowResize().subscribe();
    setTimeout(_ => this._overlay.computePos.next(true), 1);
    return this;
  }

  close() {
    this._overlay.destroy();
    // this._messenger.post({ name: 'REMOVE_OVERLAY_INS', data: this.id });
    this.cleanup();
    this._overlay.cleanup();
    BlinkRef.c++;
    console.log(`SparkleRef called: ${BlinkRef.c} times`);
  }

  onDocumentClick(): Observable<any> {
    return fromEvent(this._overlay.container, 'click').pipe(
      takeUntil(this.alive),
      map((e: any) => e.target),
      filter(this._overlay.isHostContainerElement.bind(this._overlay)),
      tap(() => this.close())
    );
  }

  onWindowResize(): Observable<any> {
    const onResize = fromEvent(window, 'resize');
    const onScroll = fromEvent(window, 'scroll', { passive: true });
    return merge(onResize, onScroll).pipe(
      takeUntil(this.alive),
      debounceTime(5),
      observeOn(animationFrameScheduler),
      distinctUntilChanged(),
      tap(() => {
        this._overlay.computePos.next(true);
        this._overlay.config.windowResizeCallback();
      })
    );
  }

  private addEvent(name, type) {
    if (type.events) {
      this.events[name] = type.events.asObservable().pipe(takeUntil(this.alive));
    }
  }

  private cleanup() {
    this.alive.next(true);
  }
}
