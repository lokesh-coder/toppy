import {
  Injectable,
  ApplicationRef,
  ComponentFactoryResolver,
  Injector,
  Component,
  EmbeddedViewRef,
  ComponentDecorator
} from '@angular/core';
import { ComponentType } from './models';
import { ComponentInstance } from './component-ins';
import { BlinkCurrentOverlay } from './blink-current-overlay';

@Injectable()
export class ComponentHost<C> {
  private compFac;
  private compRef;
  private component;
  private componentProps;
  compIns: ComponentInstance<C>;
  constructor(
    private appRef: ApplicationRef,
    private compFacResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  configure(component: ComponentType<C>, props = {}) {
    this.component = component;
    this.componentProps = props;
  }

  attach(): ComponentHost<C> {
    this.compFac = this.compFacResolver.resolveComponentFactory(this.component);
    const dataInjector = Injector.create({
      providers: [
        {
          provide: BlinkCurrentOverlay,
          useFactory: () => new BlinkCurrentOverlay(this.componentProps.id),
          deps: []
        }
      ],
      parent: this.injector
    });
    this.compRef = this.compFac.create(dataInjector);
    this.compIns = this.compRef.instance = <ComponentInstance<C>>(
      new ComponentInstance(this.compRef.instance, this.componentProps)
    );
  //  support templateRef/string
    this.appRef.attachView(this.compRef.hostView);
    return this;
  }

  getCompIns(): ComponentInstance<C> {
    return this.compIns;
  }

  detach() {
    if (!this.compRef) {
      return;
    }
    this.appRef.detachView(this.compRef.hostView);
    this.compRef.destroy();
  }

  componentView(): HTMLElement {
    if (!this.compRef || this.appRef.viewCount === 0) {
      return null;
    }
    return (this.compRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
  }
}
