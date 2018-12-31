import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
import { DefaultConfig } from './config';
import { ContentData, ContentProps, ContentType, Inputs, InsidePlacement, TID, ToppyConfig } from './models';
import { GlobalPosition } from './position';
import { ToppyPosition } from './position/position';
import { ToppyControl } from './toppy-control';
import { Bus, createId, getContent } from './utils';

@Injectable({
  providedIn: 'root'
})
export class Toppy {
  static controls: { [key: string]: ToppyControl } = {};
  private tid: TID;
  private inputs: Inputs = {
    position: null,
    config: DefaultConfig,
    content: { type: ContentType.STRING, data: 'hello', props: {} },
    tid: null
  };

  constructor(private injector: Injector) {
    this.inputs.position = new GlobalPosition({ placement: InsidePlacement.TOP });
  }

  position(position: ToppyPosition): Toppy {
    this.inputs.position = position;
    return this;
  }

  config(config: Partial<ToppyConfig>): Toppy {
    this.inputs.config = { ...DefaultConfig, ...config };
    return this;
  }

  content(data: ContentData, props: ContentProps = {}): Toppy {
    this.inputs.content = getContent(data, props);
    return this;
  }

  create(key: string = null): ToppyControl {
    this.tid = this.inputs.tid = key || createId();

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
    if (Toppy.controls[this.tid]) {
      this.tid = createId();
    }
    this.inputs.position.init(this.tid);
    Toppy.controls[this.tid] = Object.assign(tc, this.inputs);
    return tc;
  }

  getCtrl(tid: TID): ToppyControl {
    return Toppy.controls[tid];
  }

  destroy() {
    // tslint:disable-next-line:forin
    for (const key in Toppy.controls) {
      Toppy.controls[key].close();
    }
    Toppy.controls = {};
    Bus.stop();
  }
}
