import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector, OnDestroy } from '@angular/core';
import { DefaultConfig } from './config';
import { ContentData, ContentProps, InsidePlacement, ToppyConfig } from './models';
import { GlobalPosition } from './position';
import { Position } from './position/position';
import { ToppyControl } from './toppy-control';
import { Bus, createId, getContent, newInjector } from './utils';

@Injectable({
  providedIn: 'root'
})
export class Toppy implements OnDestroy {
  static controls: { [key: string]: ToppyControl } = {};
  private _tid: string;
  private _inputs = {
    position: null,
    config: null,
    content: null,
    tid: null
  };

  constructor(private injector: Injector) {
    this._inputs.config = DefaultConfig;
    this._inputs.position = new GlobalPosition({ placement: InsidePlacement.TOP });
  }

  position(position: Position): Toppy {
    this._inputs.position = position;
    return this;
  }

  config(config: Partial<ToppyConfig>): Toppy {
    this._inputs.config = { ...DefaultConfig, ...config };
    return this;
  }

  content(data: ContentData, props: ContentProps = {}): Toppy {
    this._inputs.content = getContent(data, props);
    return this;
  }

  create(key: string = null): ToppyControl {
    if (!this._inputs.content) this.content('hello');
    this._tid = this._inputs.tid = key || createId();

    this._inputs.position.init(this._tid);
    const injector = newInjector(
      {
        provide: ToppyControl,
        deps: [ApplicationRef, ComponentFactoryResolver, Injector]
      },
      this.injector
    );
    const tc = injector.get(ToppyControl);
    if (Toppy.controls[this._tid]) {
      this._tid = createId();
    }
    Toppy.controls[this._tid] = Object.assign(tc, this._inputs);
    return tc;
  }

  getCtrl(tid): ToppyControl {
    return Toppy.controls[tid];
  }

  ngOnDestroy() {
    // tslint:disable-next-line:forin
    for (const key in Toppy.controls) {
      Toppy.controls[key].close();
    }
    Toppy.controls = {};
    Bus.stop();
  }
}
