import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Config } from './config';
import { DomHelper } from './helper/dom';
import { EventBus } from './helper/event-bus';
import { DefaultPosition } from './position';
import { Position } from './position/position';

@Injectable()
export class OverlayInstance implements OnDestroy {
  computePosition: Subject<boolean> = new Subject();

  private _overlayID: string;
  private _position: Position;
  private _viewEl: HTMLElement;
  private _wrapperEl: HTMLElement;
  private _containerEl: HTMLElement;
  private _backdropEl: HTMLElement;
  private _positionSubscription: Subscription;

  constructor(public config: Config, private _eventBus: EventBus, private _dom: DomHelper) {}

  configure(position: Position = new DefaultPosition(), overlayID?: string) {
    this._position = position;
    this._overlayID = overlayID;
  }

  create() {
    this._containerEl = this._dom.createElement('div', {
      'data-overlay-id': this._overlayID,
      class: this.config.containerClass + ' ' + this._position.getClassName(),
      style: `left:0;position: fixed;top: 0;width: 100%;height: 100%;${!this.config.dismissOnDocumentClick ? 'pointer-events:none' : ''}`
    });

    this._wrapperEl = this._dom.createElement('div', {
      class: this.config.wrapperClass,
      style: 'position: absolute;transition:all 0.2s ease;'
    });

    if (this.config.backdrop) {
      this._backdropEl = this._dom.createElement('div', {
        class: this.config.backdropClass,
        style: 'left:0;position: fixed;top: 0;width: 100%;height: 100%;background: rgba(63, 81, 181, 0.39);'
      });
      this._dom.insertChildren(this._containerEl, this._backdropEl);
    }

    this._setPosition();
    this._dom.insertChildren(this.config.parentElement || this._dom.html.BODY, this._containerEl, this._wrapperEl);
    this._eventBus.post({ name: 'ATTACHED', data: null });
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

  destroy(): void {
    this._dom.removeElement(this._containerEl);
    this._eventBus.post({ name: 'DETACHED', data: null });
    this._cleanup();
  }

  ngOnDestroy(): void {
    if (this._positionSubscription) {
      this._positionSubscription.unsubscribe();
    }
  }

  private _cleanup(): void {
    if (this._positionSubscription) {
      this._positionSubscription.unsubscribe();
    }
    this._containerEl = this._wrapperEl = this._backdropEl = this._viewEl = null;
  }

  private _setPosition(): void {
    const coords = this._position.getPositions(this._wrapperEl);
    this._dom.setPositions(this._wrapperEl, coords);
    this._eventBus.post({ name: 'POSITION_UPDATED', data: null });
  }

  private _watchPositionChange(): void {
    this._positionSubscription = this.computePosition.subscribe(_ => this._setPosition());
  }
}
