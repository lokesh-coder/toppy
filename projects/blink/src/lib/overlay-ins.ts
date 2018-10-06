import { Injectable, Component, ComponentDecorator } from '@angular/core';
import { OverlayInstanceConfig, ContainerSize, ComponentType } from './models';
import { DomHelper } from './helper/dom';
import { Position } from './position/position';
import { fromEvent } from 'rxjs';
import { DefaultPosition } from './position/default-position';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';
import { of } from 'rxjs';
import { Messenger } from './helper/messenger';
import { ComponentHost } from './host';
import { Subscription } from 'rxjs';

export const DefaultOverlayInstanceConfig: OverlayInstanceConfig = {
  backdrop: false,
  containerClass: 'overlay-container',
  hostContainerClass: 'host-container',
  backdropClass: 'backdrop',
  watchWindowResize: false,
  watchDocClick: false,
  windowResizeCallback: () => {},
  docClickCallback: () => {},
  parentElement: null
};
@Injectable()
export class OverlayInstance {
  private position: Position;
  private view: HTMLElement;
  config: OverlayInstanceConfig;
  computePos: Subject<boolean> = new Subject();
  hostContainer: HTMLElement;
  container: HTMLElement;
  backdrop: HTMLElement;
  id: string;
  positionSubscription: Subscription;
  events: BehaviorSubject<string> = new BehaviorSubject('init');

  constructor(public dom: DomHelper, public host: ComponentHost<any>, private messenger: Messenger) {}

  configure(position: Position = new DefaultPosition(), id?: string, config: Partial<OverlayInstanceConfig> = {}) {
    this.config = { ...DefaultOverlayInstanceConfig, ...config };
    this.position = position;
    this.id = id;
  }

  create() {
    this.container = this.dom.createElement('div', {
      className: this.config.containerClass + ' ' + this.position.getClassName(),
      attr: {
        'data-overlay-id': this.id,
        style: 'left:0;position: fixed;top: 0;width: 100%;height: 100%;'
      }
    });
    this.backdrop = this.dom.createElement('div', {
      className: this.config.backdropClass,
      attr: {
        style: 'left:0;position: fixed;top: 0;width: 100%;height: 100%;background: rgba(63, 81, 181, 0.39);'
      }
    });
    this.hostContainer = this.dom.createElement('div', {
      className: this.config.hostContainerClass,
      attr: {
        style: 'position: absolute;'
      }
    });
    if (this.config.backdrop) {
      this.dom.insertChildren(this.container, this.backdrop);
    }

    const coords = this.position.getPositions(this.hostContainer);
    this.dom.setPositions(this.hostContainer, coords);
    this.dom.insertChildren(this.config.parentElement || this.dom.html.BODY, this.container, this.hostContainer);
    this.events.next('attached');
    this.calculateCoords();
    return this;
  }

  destroy() {
    this.host.detach();
    this.dom.removeElement(this.container);
    this.events.next('detached');
    this.events.complete();
  }

  setView(view) {
    this.view = view;
    this.dom.insertChildren(this.hostContainer, view);
    // this.computePos.next(true);
  }

  isHostContainerElement(element): boolean {
    return element !== this.hostContainer && element !== this.view && !this.view.contains(element);
  }

  cleanup() {
    this.positionSubscription.unsubscribe();
    this.container = this.hostContainer = this.backdrop = this.view = null;
  }

  clientAccess() {
    return {
      destroy: this.destroy.bind(this)
    };
  }

  private calculateCoords() {
    this.positionSubscription = this.computePos.subscribe(res => {
      const coords = this.position.getPositions(this.hostContainer);
      this.dom.setPositions(this.hostContainer, coords);
      this.events.next('positions updated');
      console.log({ coords });
    });
  }

  private watchSrcElementPos() {
    of((this.position as any).src).subscribe(e => {});
  }
}
