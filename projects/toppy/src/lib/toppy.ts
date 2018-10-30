import { Injectable, OnDestroy, TemplateRef } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Config } from './config';
import { EventBus } from './helper/event-bus';
import { HostContainer } from './host-container';
import { BaseConfig, ComponentType, HostArgs } from './models';
import { OverlayInstance } from './overlay-instance';
import { Position } from './position/position';
import { ToppyRef } from './toppy-ref';

@Injectable({
  providedIn: 'root'
})
export class Toppy implements OnDestroy {
  toppyRefs: { [key: string]: ToppyRef } = {};
  private _overlayID: string;

  constructor(
    private _overlayIns: OverlayInstance,
    private _hostContainer: HostContainer,
    private _config: Config,
    private _eventBus: EventBus
  ) {
    this._eventBus
      .watch()
      .pipe(filter(e => e.name === 'REMOVE_OVERLAY_INS'))
      .subscribe(e => delete this.toppyRefs[e.data]);
  }

  overlay(position: Position, config: Partial<BaseConfig> = {}): Toppy {
    this._config.set(config);
    this._overlayID = this._generateID();
    this._overlayIns.configure(position, this._overlayID);
    this._hostContainer.toppyRef = this.getToppyRef.bind(this);
    return this;
  }

  host(content: string | TemplateRef<any> | ComponentType<any>, props: { [x: string]: any } = {}) {
    let data: HostArgs;

    if (typeof content === 'string') {
      data = { content };
    } else if (typeof content === 'string' && props['hasHTML']) {
      data = { content, props };
    } else if (content instanceof TemplateRef) {
      data = { content, contentType: 'TEMPLATEREF' };
    } else {
      data = {
        content,
        props: { ...props, id: this._overlayID },
        contentType: 'COMPONENT'
      };
    }
    this._hostContainer.configure(data);
    return this;
  }

  create(): ToppyRef {
    if (this.toppyRefs[this._overlayID]) {
      this.toppyRefs[this._overlayID].close();
      delete this.toppyRefs[this._overlayID];
    }
    this.toppyRefs[this._overlayID] = new ToppyRef(
      this._overlayIns,
      this._hostContainer,
      this._eventBus,
      this._config,
      this._overlayID
    );
    return this.toppyRefs[this._overlayID];
  }

  getToppyRef(id) {
    return this.toppyRefs[id];
  }

  ngOnDestroy() {
    this._eventBus.destroy();
  }

  private _generateID(): string {
    return Math.random()
      .toString(36)
      .substr(2, 5);
  }
}
