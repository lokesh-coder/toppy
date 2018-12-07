import {
  ApplicationRef,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  Injector,
  Sanitizer,
  TemplateRef,
  ViewRef
} from '@angular/core';
import { CurrentOverlay } from './current-overlay';
import { HostArgs, HostContentType } from './models';
import { ToppyRef } from './toppy-ref';

@Injectable({
  providedIn: 'root'
})
export class HostContainer {
  private _compFac: ComponentFactory<any>;
  private _compRef: ComponentRef<any>;
  private _contentType: HostContentType;
  private _compIns: any;
  private _contentProps: { [key: string]: any };
  private _content: any;
  toppyRef: (id: string) => ToppyRef;
  constructor(
    private _appRef: ApplicationRef,
    private _compFacResolver: ComponentFactoryResolver,
    private _injector: Injector,
    private _sanitizer: Sanitizer
  ) {}

  configure(
    { contentType, content, props }: HostArgs = {
      content: 'hello',
      contentType: 'STRING'
    }
  ) {
    this._contentType = contentType;
    this._contentProps = props;
    this._content = content;
  }

  createViewFromString(content: string, props: any = {}): HTMLElement {
    const contentWrapperEl = document.createElement('div');
    contentWrapperEl.innerText = content;
    contentWrapperEl.classList.add(...[props.class || 'toppy-text-content']);
    return contentWrapperEl;
  }
  createViewFromTemplate(template: TemplateRef<any>, ctx: any = {}): EmbeddedViewRef<any> {
    const data = ctx.id ? new CurrentOverlay(this.toppyRef(ctx.id)) : {};
    return template.createEmbeddedView({ $implicit: data });
  }
  createViewFromComponent(component, props: any = {}): ViewRef {
    this._compFac = this._compFacResolver.resolveComponentFactory(component);
    const dataInjector = Injector.create({
      providers: [
        {
          provide: CurrentOverlay,
          useFactory: () => new CurrentOverlay(this.toppyRef(props.id)),
          deps: []
        }
      ],
      parent: this._injector
    });
    this._compRef = this._compFac.create(dataInjector);
    Object.keys(props).forEach(key => {
      this._compRef.instance[key] = props[key];
    });
    this._compIns = this._compRef.instance;
    return this._compRef.hostView;
  }

  attach(): HTMLElement {
    let view: any = null;
    let viewEl = null;
    switch (this._contentType) {
      case 'COMPONENT':
        view = this.createViewFromComponent(this._content, this._contentProps);
        this._appRef.attachView(view);
        viewEl = this.getComponentViewEl();
        break;
      case 'TEMPLATEREF':
        view = this.createViewFromTemplate(this._content, this._contentProps);
        this._appRef.attachView(view);
        viewEl = view.rootNodes[0];
        break;
      case 'STRING':
        const el = document.createElement('div');
        el.innerHTML = this._sanitizer.sanitize(1, this._content);
        return el as any;
      default:
        return this.createViewFromString(this._content, this._contentProps);
    }
    return viewEl;
  }

  detach(): void {
    if (!this._compRef) {
      return;
    }
    this._appRef.detachView(this._compRef.hostView);
    this._compRef.destroy();
  }

  getComponentViewEl(): null | HTMLElement {
    if (this._appRef.viewCount === 0) {
      return null;
    }
    return (this._compRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
  }

  getCompIns() {
    return this._compIns;
  }

  reset() {
    this._contentType = null;
    this._contentProps = null;
    this._content = null;
  }

  getNewInstance() {
    return new HostContainer(this._appRef, this._compFacResolver, this._injector, this._sanitizer);
  }
}
