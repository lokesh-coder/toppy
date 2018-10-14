import {
  Injectable,
  ApplicationRef,
  ComponentFactoryResolver,
  Injector,
  Component,
  EmbeddedViewRef,
  ComponentDecorator,
  TemplateRef
} from '@angular/core';
import { ComponentType } from './models';
import { ComponentInstance } from './component-ins';
import { BlinkCurrentOverlay } from './blink-current-overlay';
import { ViewRef } from '@angular/core/src/render3/view_ref';

@Injectable()
export class ComponentHost<C> {
  private compFac;
  private compRef;
  private component;
  private componentProps;
  private content: string;
  private htmlContent: string;
  private template: TemplateRef<any>;
  compIns: ComponentInstance<C>;
  constructor(
    private appRef: ApplicationRef,
    private compFacResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  configure({
    component,
    props,
    template,
    content,
    htmlContent
  }: Partial<{
    component: ComponentType<C>;
    props: object;
    template: TemplateRef<any>;
    content: string;
    htmlContent: string;
  }>) {
    this.component = component;
    this.componentProps = props;
    this.template = template;
    this.content = content;
    this.htmlContent = htmlContent;
  }

  createViewFromString(content: string) {
    return document.createTextNode(content);
  }
  createViewFromTemplate(template: TemplateRef<any>, ctx = {}) {
    return template.createEmbeddedView(ctx);
  }
  createViewFromComponent(component, props: any = {}) {
    this.compFac = this.compFacResolver.resolveComponentFactory(component);
    const dataInjector = Injector.create({
      providers: [
        {
          provide: BlinkCurrentOverlay,
          useFactory: () => new BlinkCurrentOverlay(props.id),
          deps: []
        }
      ],
      parent: this.injector
    });
    this.compRef = this.compFac.create(dataInjector);
    this.compIns = this.compRef.instance = <ComponentInstance<C>>new ComponentInstance(this.compRef.instance, props);
    return this.compRef.hostView;
  }

  attach(): HTMLElement {
    let view: EmbeddedViewRef<any> = null;
    let viewEl = null;
    if (this.component) {
      view = this.createViewFromComponent(this.component, this.componentProps);
      viewEl = this.componentView();
    } else if (this.template) {
      view = this.createViewFromTemplate(this.template);
      viewEl = view.rootNodes[0];
    } else if (this.content) {
      return document.createTextNode(this.content) as any;
    } else if (this.htmlContent) {
      const el = document.createElement('div');
      el.innerHTML = this.htmlContent;
      return el as any;
    }
    //  support templateRef/string
    this.appRef.attachView(view);
    return viewEl;
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
  templateView() {
    return this.template.elementRef;
  }
}
