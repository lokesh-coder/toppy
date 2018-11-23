import { Injectable, OnDestroy, TemplateRef } from '@angular/core';
import { filter } from 'rxjs/operators';
import { DefaultConfig } from './config';
import { EventBus } from './helper/event-bus';
import { HostContainer } from './host-container';
import { ComponentType, ToppyConfig } from './models';
import { OverlayInstance } from './overlay-instance';
import { Position } from './position/position';
import { ToppyRef } from './toppy-ref';
import { getContentMeta } from './utils';

@Injectable({
  providedIn: 'root'
})
export class Toppy implements OnDestroy {
  static toppyRefs: { [key: string]: ToppyRef } = {};
  private _overlayID: string;
  private _config: ToppyConfig;
  private _hostContainerFreshInstance: HostContainer;
  private _overlayFreshInstance: OverlayInstance;

  constructor(
    private _eventBus: EventBus,
    private _overlayIns: OverlayInstance,
    private _hostContainer: HostContainer
  ) {}

  overlay(position: Position, config: Partial<ToppyConfig> = {}): Toppy {
    this._hostContainerFreshInstance = this._hostContainer.getNewInstance();
    this._overlayFreshInstance = this._overlayIns.getNewInstance();
    this._config = { ...DefaultConfig, ...config };
    this._overlayID = this._generateID();
    this._overlayFreshInstance.setConfig(this._config).configure(position, this._overlayID);
    this._hostContainerFreshInstance.toppyRef = this.getToppyRef.bind(this);
    return this;
  }

  host(content: string | TemplateRef<any> | ComponentType<any>, props: { [x: string]: any } = {}) {
    const data = getContentMeta(content, props, this._overlayID);
    this._hostContainerFreshInstance.configure(data);
    return this;
  }

  create(): ToppyRef {
    if (Toppy.toppyRefs[this._overlayID]) {
      Toppy.toppyRefs[this._overlayID].close();
      delete Toppy.toppyRefs[this._overlayID];
    }
    Toppy.toppyRefs[this._overlayID] = new ToppyRef(
      this._overlayFreshInstance,
      this._hostContainerFreshInstance,
      this._eventBus,
      this._config,
      this._overlayID
    );
    return Toppy.toppyRefs[this._overlayID];
  }

  delete(overlyID) {
    this._eventBus
      .watch()
      .pipe(filter(e => e.name === 'REMOVED_OVERLAY_INS'))
      .subscribe(e => delete Toppy.toppyRefs[overlyID]);
  }

  getToppyRef(id) {
    return Toppy.toppyRefs[id];
  }

  ngOnDestroy() {
    Toppy.toppyRefs = {};
    this._eventBus.destroy();
  }

  private _generateID(): string {
    return Math.random()
      .toString(36)
      .substr(2, 5);
  }
}
