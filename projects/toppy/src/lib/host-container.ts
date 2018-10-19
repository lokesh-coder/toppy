import {
  Injectable,
  ApplicationRef,
  ComponentFactoryResolver,
  Injector,
  EmbeddedViewRef,
  TemplateRef
} from '@angular/core';
import { ComponentType, HostContentType, HostArgs, HostContentValue } from './models';
import { ComponentInstance } from './component-ins';
import { ToppyCurrentOverlay } from './toppy-current-overlay';

@Injectable()
export class HostContainer<C> {
  private compFac;
  private compRef;
  private contentType: HostContentType;
  private contentProps;
  private content;
  private template: TemplateRef<any>;
  compIns: ComponentInstance<C>;
  toppyRef;
  constructor(
    private appRef: ApplicationRef,
    private compFacResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  configure(
    { contentType, content, props }: HostArgs = {
      content: 'hello',
      contentType: 'STRING'
    }
  ) {
    this.contentType = contentType;
    this.contentProps = props;
    this.content = content;
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
          provide: ToppyCurrentOverlay,
          useFactory: () => new ToppyCurrentOverlay(this.toppyRef(props.id), props.id),
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
    switch (this.contentType) {
      case 'COMPONENT':
        view = this.createViewFromComponent(this.content, this.contentProps);
        viewEl = this.componentView();
        break;
      case 'TEMPLATEREF':
        view = this.createViewFromTemplate(this.content);
        viewEl = view.rootNodes[0];
        break;
      case 'STRING':
        const el = document.createElement('div');
        el.innerHTML = this.content;
        return el as any;
      default:
        return document.createTextNode(this.content) as any;
    }
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
