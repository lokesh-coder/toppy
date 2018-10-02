import { Injectable } from '@angular/core';
import { Position } from './position/position';
import { OverlayInstance } from './overlay-ins';
import { ComponentHost } from './host';
import { DomHelper } from './helper/dom';
import { BlinkRef } from './blink-ref';
import { ComponentType, OverlayInstanceConfig, Props } from './models';
import { Utils } from './helper/utils';
import { Messenger } from './helper/messenger';
import { filter } from 'rxjs/operators';

@Injectable()
export class Blink<C> {
  private _id: string;
  private _blinkRefs = [];
  constructor(
    private _overlay: OverlayInstance,
    private _host: ComponentHost<C>,
    private _messenger: Messenger,
    private utils: Utils
  ) {
    this._messenger
      .watch()
      .pipe(filter(e => e.name === 'REMOVE_OVERLAY_INS'))
      .subscribe(e => {
        delete this._blinkRefs[e.data];
      });
  }
  overlay(position: Position, id = this.utils.ID, config: Partial<OverlayInstanceConfig> = {}): Blink<C> {
    this._id = id;
    this._overlay.configure(position, id, config);
    return this;
  }
  host(component: ComponentType<C>, props: Props<C> = {}): Blink<C> {
    this._host.configure(component, props);
    return this;
  }
  create(): BlinkRef<C> {
    if (this._blinkRefs[this._id]) {
      this._blinkRefs[this._id].close();
      delete this._blinkRefs[this._id];
    }
    this._blinkRefs[this._id] = new BlinkRef(this._overlay, this._host, this._messenger, this._id);
    return this._blinkRefs[this._id];
  }
}
