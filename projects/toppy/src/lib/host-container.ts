import {
  ApplicationRef,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  Injectable,
  Injector,
  TemplateRef
} from '@angular/core';
import { ComponentInstance } from './component-ins';
import { CurrentOverlay } from './current-overlay';
import { HostArgs, HostContentType } from './models';

@Injectable()
export class HostContainer {
  private compFac;
  private compRef;
  private contentType: HostContentType;
  private contentProps;
  private content;
  private template: TemplateRef<any>;
  compIns: ComponentInstance;
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
          provide: CurrentOverlay,
          useFactory: () => new CurrentOverlay(this.toppyRef(props.id)),
          deps: []
        }
      ],
      parent: this.injector
    });
    this.compRef = this.compFac.create(dataInjector);
    this.compIns = this.compRef.instance = <ComponentInstance>new ComponentInstance(this.compRef.instance, props);
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

  getCompIns(): ComponentInstance {
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
