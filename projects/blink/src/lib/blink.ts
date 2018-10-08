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
import { OverlayConfig } from './config';

@Injectable({
  providedIn: 'root'
})
export class Blink<C> {
  static refs = [];
  private _id: string;
  constructor(
    private _overlay: OverlayInstance,
    private _host: ComponentHost<C>,
    private _config: OverlayConfig,
    private _messenger: Messenger,
    private utils: Utils
  ) {
    this._messenger
      .watch()
      .pipe(filter(e => e.name === 'REMOVE_OVERLAY_INS'))
      .subscribe(e => {
        delete Blink.refs[e.data];
      });
  }
  overlay(position: Position, config: Partial<OverlayInstanceConfig> = {}, id = this.utils.ID): Blink<C> {
    this._id = id;
    this._overlay.configure(position, id);
    this._config.set(config);
    return this;
  }
  host(component: ComponentType<C>, props: Props<C> = {}): Blink<C> {
    this._host.configure(component, { ...(props as any), id: this._id });
    return this;
  }
  create(): BlinkRef<C> {
    if (Blink.refs[this._id]) {
      Blink.refs[this._id].close();
      // delete Blink.refs[this._id];
    }
    Blink.refs[this._id] = new BlinkRef(this._overlay, this._host, this._messenger, this._config, this._id);
    console.log('here it is', Blink.refs);
    return Blink.refs[this._id];
  }
  getBlinkRef(id) {
    return Blink.refs[id];
  }
}
