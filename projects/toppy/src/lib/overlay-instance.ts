import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { DomHelper } from './helper/dom';
import { EventBus } from './helper/event-bus';
import { ToppyConfig } from './models';
import { DefaultPosition } from './position';
import { Position } from './position/position';

@Injectable({
  providedIn: 'root'
})
export class OverlayInstance implements OnDestroy {
  computePosition: Subject<boolean> = new Subject();
  config: ToppyConfig;
  private _overlayID: string;
  private _position: Position;
  private _viewEl: HTMLElement;
  private _wrapperEl: HTMLElement;
  private _containerEl: HTMLElement;
  private _backdropEl: HTMLElement;
  private _alive: Subject<Boolean> = new Subject();

  constructor(private _eventBus: EventBus, private _dom: DomHelper) {}

  setConfig(config: ToppyConfig) {
    this.config = config;
    return this;
  }

  configure(position: Position = new DefaultPosition(), overlayID?: string) {
    this._position = position;
    this._overlayID = overlayID;
    this.updateOverlayClassInBody();
  }

  changePosition(newPosition) {
    this._position = newPosition;
  }

  updatePositionConfig(positionConfig) {
    this._position.updateConfig(positionConfig);
  }

  create() {
    this._containerEl = this._dom.createElement('div', {
      'data-overlay-id': this._overlayID,
      class: this.config.containerClass + ' ' + this._position.getClassName(),
      style: `left:0;position: fixed;top: 0;width: 100%;height: 100%;${
        !this.config.dismissOnDocumentClick ? 'pointer-events:none' : ''
      }`
    });

    this._wrapperEl = this._dom.createElement('div', {
      class: this.config.wrapperClass,
      style: 'position: absolute;visibility:hidden;opacity:0;transition:opacity 0.2s ease;overflow: hidden;'
    });

    if (this.config.backdrop) {
      this._backdropEl = this._dom.createElement('div', {
        class: this.config.backdropClass,
        style: 'left:0;position: fixed;top: 0;width: 100%;height: 100%;background: rgba(0, 0, 0, 0.5);'
      });
      this._dom.insertChildren(this._containerEl, this._backdropEl);
    }

    this._setPosition();
    this._position.setEventBus(this._eventBus);
    this._dom.insertChildren(this.config.parentElement || this._dom.html.BODY, this._containerEl, this._wrapperEl);
    this._eventBus.post({ name: 'ATTACHED', data: null });
    this._onNewComputedPosition();
    this._watchPositionChange();
    return this;
  }

  setView(view: HTMLElement): void {
    this._viewEl = view;
    this._dom.insertChildren(this._wrapperEl, view);
  }

  isHostElement(element): boolean {
    return element !== this._wrapperEl && element !== this._viewEl && !this._viewEl.contains(element);
  }

  getContainerEl(): HTMLElement {
    return this._containerEl;
  }

  getNewInstance() {
    return new OverlayInstance(this._eventBus, this._dom);
  }

  destroy(): void {
    this._dom.removeElement(this._containerEl);
    this._eventBus.post({ name: 'DETACHED', data: null });
    this._cleanup();
  }

  updateOverlayClassInBody() {
    this._eventBus.watch().subscribe(event => {
      if (!this.config || this.config.bodyClassNameOnOpen === '' || event.data !== this._overlayID) {
        return;
      }
      if (event.name === 'OPENED_OVERLAY_INS') {
        this._dom.addClassNameToBody(this.config.bodyClassNameOnOpen);
      } else if (event.name === 'REMOVED_OVERLAY_INS') {
        this._dom.removeClassNameFromBody(this.config.bodyClassNameOnOpen);
      }
    });
  }

  ngOnDestroy(): void {
    this._alive.next(false);
  }

  private _cleanup(): void {
    this._alive.next(false);
    this._containerEl = this._wrapperEl = this._backdropEl = this._viewEl = null;
  }

  private _setPosition(show = false): void {
    const coords = this._position.getPositions(this._wrapperEl);
    this._dom.setPositions(this._wrapperEl, coords);

    if (show) {
      this._wrapperEl.style.visibility = 'visible';
      this._wrapperEl.style.opacity = '1';
    }
    this._eventBus.post({ name: 'POSITION_UPDATED', data: null });
  }

  private _watchPositionChange() {
    this._eventBus
      .watch()
      .pipe(
        filter(data => data.name === 'NEW_DYN_POS'),
        map(d => d.data),
        takeUntil(this._alive)
      )
      .subscribe(e => {
        if (!e) {
          return this._setPosition(true);
        }
        this._dom.setPositions(this._wrapperEl, { left: e.x, top: e.y });
      });
  }
  private _onNewComputedPosition(): void {
    this.computePosition.pipe(takeUntil(this._alive)).subscribe(_ => {
      this._setPosition(true);
    });
  }
}
