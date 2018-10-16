import { Injectable, TemplateRef, Component } from '@angular/core';
import { filter } from 'rxjs/operators';
import { BlinkRef } from './blink-ref';
import { Messenger } from './helper/messenger';
import { HostContainer } from './host-container';
import { ComponentType, Config, Props } from './models';
import { OverlayConfig } from './overlay-config';
import { OverlayInstance } from './overlay-instance';
import { Position } from './position/position';

@Injectable({
  providedIn: 'root'
})
export class Blink<C> {
  refs = [];
  private _overlayID: string;
  constructor(
    private _overlayIns: OverlayInstance,
    private _hostContainer: HostContainer<C>,
    private _config: OverlayConfig,
    private _messenger: Messenger
  ) {
    this._messenger
      .watch()
      .pipe(filter(e => e.name === 'REMOVE_OVERLAY_INS'))
      .subscribe(e => {
        delete this.refs[e.data];
      });
  }
  overlay(position: Position, config: Partial<Config> = {}): Blink<C> {
    this._overlayID = this._generateOverlayID();
    this._overlayIns.configure(position, this._overlayID);
    this._config.set(config);
    this._hostContainer.blinkRef = this.getBlinkRef.bind(this);
    return this;
  }

  host(content: string | TemplateRef<any> | ComponentType<C>, props: Props<C> = {}) {
    if (typeof content === 'string') {
      this._hostContainer.configure({ content });
    } else if (typeof content === 'string' && props['hasHTML']) {
      this._hostContainer.configure({ htmlContent: content });
    } else if (content instanceof TemplateRef) {
      this._hostContainer.configure({ template: content });
    } else {
      this._hostContainer.configure({ component: content, props: { ...(props as any), id: this._overlayID } });
    }
    return this;
  }

  create(): BlinkRef<C> {
    if (this.refs[this._overlayID]) {
      this.refs[this._overlayID].close();
      delete this.refs[this._overlayID];
    }
    this.refs[this._overlayID] = new BlinkRef(
      this._overlayIns,
      this._hostContainer,
      this._messenger,
      this._config,
      this._overlayID
    );
    console.log('here it is', this.refs);
    return this.refs[this._overlayID];
  }
  getBlinkRef(id) {
    return this.refs[id];
  }

  private _generateOverlayID(): string {
    return Math.random()
      .toString(36)
      .substr(2, 5);
  }
}
