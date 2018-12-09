import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector, OnDestroy } from '@angular/core';
import { DefaultConfig } from './config';
import { HostContentValue, InsidePlacement, ToppyConfig } from './models';
import { GlobalPosition } from './position';
import { Position } from './position/position';
import { ToppyControl } from './toppy-control';
import { destroyEvents, getContentMeta } from './utils';

@Injectable({
  providedIn: 'root'
})
export class Toppy implements OnDestroy {
  static toppyRefs: { [key: string]: ToppyControl } = {};
  private tid: string;
  private _essentials = {
    position: null,
    config: null,
    content: null,
    tid: null
  };

  constructor(private injector: Injector) {
    this._essentials.config = DefaultConfig;
    this._essentials.position = new GlobalPosition({ placement: InsidePlacement.TOP });
  }

  position(position: Position) {
    this._essentials.position = position;
    return this;
  }

  config(config: Partial<ToppyConfig>) {
    this._essentials.config = { ...DefaultConfig, ...config };
    return this;
  }

  content(data: HostContentValue, props: { [x: string]: any } = {}) {
    this.tid = this._essentials.tid = this._generateID();
    this._essentials.content = getContentMeta(data, { ...props, id: this.tid });
    return this;
  }

  execute() {
    if (!this._essentials.content) {
      this.content('hello');
    }
    const injector = Injector.create(
      [
        {
          provide: ToppyControl,
          deps: [ApplicationRef, ComponentFactoryResolver, Injector]
        }
      ],
      this.injector
    );
    const tc = injector.get(ToppyControl);
    if (Toppy.toppyRefs[this.tid]) {
      Toppy.toppyRefs[this.tid].close();
      delete Toppy.toppyRefs[this.tid];
    }
    Toppy.toppyRefs[this.tid] = Object.assign(tc, this._essentials);
    return tc;
  }

  delete(tid) {
    delete Toppy.toppyRefs[tid];
  }

  getToppyRef(tid) {
    return Toppy.toppyRefs[tid];
  }

  ngOnDestroy() {
    Toppy.toppyRefs = {};
    destroyEvents();
  }

  private _generateID(): string {
    return Math.random()
      .toString(36)
      .substr(2, 5);
  }
}
