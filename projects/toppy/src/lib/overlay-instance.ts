import { Injectable, OnDestroy } from '@angular/core';
import { DomHelper } from './helper/dom';
import { Position, DefaultPosition } from './position';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { OverlayConfig } from './overlay-config';

@Injectable()
export class OverlayInstance implements OnDestroy {
  private position: Position;
  private view: HTMLElement;
  computePosition: Subject<boolean> = new Subject();
  hostContainerEl: HTMLElement;
  containerEl: HTMLElement;
  backdropEl: HTMLElement;
  id: string;
  private _positionSubscription: Subscription;
  events: BehaviorSubject<string> = new BehaviorSubject('init');

  constructor(public config: OverlayConfig, private _dom: DomHelper) {}

  configure(position: Position = new DefaultPosition(), id?: string) {
    this.position = position;
    this.id = id;
  }

  create() {
    this.containerEl = this._dom.createElement('div', {
      className: this.config.containerClass + ' ' + this.position.getClassName(),
      attr: {
        'data-overlay-id': this.id,
        style: `left:0;position: fixed;top: 0;width: 100%;height: 100%;${
          !this.config.dismissOnDocumentClick ? 'pointer-events:none' : ''
        }`
      }
    });

    this.backdropEl = this._dom.createElement('div', {
      className: this.config.backdropClass,
      attr: {
        style: 'left:0;position: fixed;top: 0;width: 100%;height: 100%;background: rgba(63, 81, 181, 0.39);'
      }
    });

    this.hostContainerEl = this._dom.createElement('div', {
      className: this.config.hostContainerClass,
      attr: {
        style: 'position: absolute;transition:all 0.2s ease;'
      }
    });

    if (this.config.backdrop) {
      this._dom.insertChildren(this.containerEl, this.backdropEl);
    }

    this._setPosition();
    this._dom.insertChildren(this.config.parentElement || this._dom.html.BODY, this.containerEl, this.hostContainerEl);
    this.events.next('attached');
    this._watchPositionChange();
    return this;
  }

  setView(view) {
    this.view = view;
    this._dom.insertChildren(this.hostContainerEl, view);
  }

  isHostContainerElement(element): boolean {
    return element !== this.hostContainerEl && element !== this.view && !this.view.contains(element);
  }

  destroy() {
    this._dom.removeElement(this.containerEl);
    this.events.next('detached');
    this.events.complete();
    this._cleanup();
  }

  private _cleanup() {
    this._positionSubscription.unsubscribe();
    this.containerEl = this.hostContainerEl = this.backdropEl = this.view = null;
  }

  private _setPosition() {
    const coords = this.position.getPositions(this.hostContainerEl);
    this._dom.setPositions(this.hostContainerEl, coords);
    this.events.next('positions updated');
  }

  private _watchPositionChange(): void {
    this._positionSubscription = this.computePosition.subscribe(_ => this._setPosition());
  }

  ngOnDestroy() {
    this._positionSubscription.unsubscribe();
  }
}
