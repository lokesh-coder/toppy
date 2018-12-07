### Introduction

**`Step 1:`** You can install through [npm](https://www.npmjs.com/package/toppy) or [yarn](https://yarnpkg.com/en/package/toppy) package managers

```sh
npm install toppy --save
```

```sh
yarn add toppy
```

**`Step 2:`** Add module in your angular app

```typescript
import { ToppyModule } from 'toppy';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ToppyModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

**`Step 3:`** Use Toppy in any component

```typescript
@Component({
  selector: 'app-root',
  template: '<div #el>Click me</div>'
})
export class AppComponent {
  @ViewChild('el', { read: ElementRef })
  el: ElementRef;

  constructor(private _toppy: Toppy) {}

  ngOnInit() {
    const position = new RelativePosition({
      placement: OutsidePlacement.BOTTOM_LEFT,
      src: this.el.nativeElement
    });

    this.overlayIns = this._toppy
      .overlay(position)
      .host('hello') // content
      .create();
  }
  open() {
    this.overlayIns.open();
  }
  close() {
    this.overlayIns.close();
  }
}
```

### Content types

**Plain text**

```typescript
this.overlayIns = this._toppy
  .overlay(position)
  .host(`some plain text content`) // simple text
  .create();
```

**Using html**

```typescript
this.overlayIns = this._toppy
  .overlay(position)
  .host(`<div>any HTML content</div>`, { hasHTML: true }) // html
  .create();
```

**Using component**

```typescript
@Component({
  template: '<div>Hello</div>'
})
export class HelloComponent {}
```

```typescript
this.overlayIns = this._toppy
  .overlay(position)
  .host(HelloComponent) // host a component
  .create();
```

**Using TemplateRef**

```html
<ng-template #tpl>Hello world!</ng-template>
```

```typescript
@ViewChild('tpl') tpl:TemplateRef<any>;

this.overlayIns = this._toppy
  .overlay(position)
  .host(this.tpl) // template ref
  .create();
```

### Positions

##### Realtive position

<app-relative-position-example></app-relative-position-example>

```typescript
new RelativePosition({
  src: HTMLElement, // target element
  placement: OutsidePlacement, // location of the content
  hostWidth: string | number, // content width eg, `auto`, 150, `30%`
  hostHeight: string | number, // content height eg, `auto`, 150, `30%`
  autoUpdate: boolean // update position when window scroll/resize/drag
});
```

##### Global position

<app-global-position-example></app-global-position-example>

```typescript
new GlobalPosition({
  placement: InsidePlacement, // location of the content.
  hostWidth: string | number, // content width eg, `auto`, `150`, `30%`
  hostHeight: string | number, //content height eg, `auto`, 150, `30%`
  offset: number // oustide space of the content, in px
});
```

##### Slide position

<app-slide-position-example></app-slide-position-example>

```typescript
new SlidePosition({
  placement: SlidePlacement, // rigth or left
  width: string // width eg, '300px' or '30%'
});
```

##### Fullscreen position

<app-fullscreen-position-example></app-fullscreen-position-example>

```typescript
new FullscreenPosition();
```

### Communication

When you host a component, you can control the overlay through `CurrentOverlay` service. As of now, this service has only one method `close` to close the overlay from the host component. But, soon more API will be added to this service.

```typescript
// host component
@Component({
  template: '<div>Some text</div>'
})
export class HostComponent {
  constructor(private _overlay: CurrentOverlay) {}

  close() {
    this._overlay.close();
  }
}
```

You can also set properties to component when creating the overlay.

```typescript
this.overlayIns = this._toppy
  .overlay(position)
  .host(HelloComponent, { propName: 'toppy-test-prop' })
  .create();
```

Now automatically all props are attached to host component and you can access it like,

```typescript
// host component
@Component({
  template: '<div>Some text</div>'
})
export class HostComponent {
  propName; // else tslint will throw error
  constructor() {
    console.log(this.propName); // will return 'toppy-test-prop'
  }
}
```

### Examples

##### 1. Stick content on dragging

In below example you can see that the tooltip content is sticked with the `src` element in `RelativePosition`

<app-drag-example></app-drag-example>

##### 2. Dynamic text content

When the provided content is just a string, you might sometimes need to update that dynamically.

<app-dynamic-text-example></app-dynamic-text-example>

##### 3. Modal content

Simple modal example shows center aligned templateRef content.

<app-modal-example></app-modal-example>

##### 4. Dropdown selector

Custom dropdown example

<app-dropdown-example></app-dropdown-example>

##### 5. Global Ribbon

Footer ribbon example

<app-ribbon-example></app-ribbon-example>

### Configuration

```typescript
// config
this.toppy
  .overlay(position:Position, configuration:ToppyConfig={})
  .host('hello')
  .create();
```

| `property`                 | `for`                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| **backdrop**               | `boolean` &middot; whether to show backdrop layer &middot; default: _false_                 |
| **closeOnEsc**             | `boolean` &middot; clicking Escape button will close overlay &middot; default: _false_      |
| **dismissOnDocumentClick** | `boolean` &middot; dismiss on clicking outside of content &middot; default: _false_         |
| **isHover**                | `boolean` &middot; should set to true if it is triggered on hover &middot; default: _false_ |
| **watchWindowResize**      | `boolean` &middot; auto adjust the position on scroll &middot; default: _true_              |
| **containerClass**         | `string` &middot; overlay container class name &middot; default: _toppy-container'_         |
| **wrapperClass**           | `string` &middot; overlay wrapper class name &middot; default: _'toppy-wrapper'_            |
| **backdropClass**          | `string` &middot; overlay backdrop class name &middot; default: _'toppy-backdrop'_          |
| **bodyClassNameOnOpen**    | `string` &middot; if set, the classname will be added when overlay is open                  |
| **windowResizeCallback**   | `function` &middot; callback function, will be triggered on window scroll                   |
| **docClickCallback**       | `function` &middot; callback function, will be triggered on document click                  |
| **parentElement**          | `HTMLElement` &middot; overlay parent element &middot; default: _body_                      |

### API

```typescript
Toppy.overlay(position:Position,config:ToppyConfig):Toppy
```

```typescript
Toppy.host(
  content: string | TemplateRef<any> | ComponentType<any>,
  props: { [x: string]: any } = {}
):Toppy
```

```typescript
Toppy.create(position:Position,config:ToppyConfig):ToppyRef
```

---

```typescript
ToppyRef.open():void
```

```typescript
ToppyRef.close():void
```

```typescript
ToppyRef.toggle():void
```

```typescript
ToppyRef.onDocumentClick():Observable
```

```typescript
ToppyRef.onWindowResize():Observable
```

```typescript
ToppyRef.getConfig():ToppyConfig
```

```typescript
ToppyRef.updateHost(
  content: string | TemplateRef<any> | ComponentType<any>,
  props: { [x: string]: any } = {}
):ToppyRef
```

```typescript
ToppyRef.updatePosition(config:object):ToppyRef
```

---

```typescript
enum OutsidePlacement {}
```

<div class="inline-code">

```typescript
OutsidePlacement.BOTTOM;
```

```typescript
OutsidePlacement.BOTTOM_LEFT;
```

```typescript
OutsidePlacement.BOTTOM_RIGHT;
```

```typescript
OutsidePlacement.LEFT;
```

```typescript
OutsidePlacement.LEFT_BOTTOM;
```

```typescript
OutsidePlacement.LEFT_TOP;
```

```typescript
OutsidePlacement.RIGHT;
```

```typescript
OutsidePlacement.RIGHT_BOTTOM;
```

```typescript
OutsidePlacement.RIGHT_TOP;
```

```typescript
OutsidePlacement.TOP;
```

```typescript
OutsidePlacement.TOP_LEFT;
```

```typescript
OutsidePlacement.TOP_RIGHT;
```

</div>

```typescript
enum InsidePlacement {}
```

<div class="inline-code">

```typescript
InsidePlacement;
```

```typescript
InsidePlacement.BOTTOM;
```

```typescript
InsidePlacement.BOTTOM_LEFT;
```

```typescript
InsidePlacement.BOTTOM_RIGHT;
```

```typescript
InsidePlacement.LEFT;
```

```typescript
InsidePlacement.RIGHT;
```

```typescript
InsidePlacement.TOP;
```

```typescript
InsidePlacement.TOP_LEFT;
```

```typescript
InsidePlacement.TOP_RIGHT;
```

```typescript
InsidePlacement.CENTER;
```

</div>

```typescript
enum SlidePlacement {}
```

<div class="inline-code">

```typescript
SlidePlacement.LEFT;
```

```typescript
SlidePlacement.RIGHT;
```

</div>

### Contibution

Any kind of contributions ( Typo fix, documentation, code quality, performance, refactor, pipeline, etc., ) are welcome. :)

### Credits

- Icons from [openmoji](http://openmoji.org)

### Issues

Found a bug? Have some idea? Or do you have questions? File it [github issues](https://github.com/lokesh-coder/toppy/issues)
