<h1 align="center">
  <br>
  <a href="https://lokesh-coder.github.io/toppy/"><img src="./docs/assets/toppy-logo.png" alt="Toppy" width="100"></a><br>
</h1>

<h4 align="center">Tiny Angular library to create overlays for tooltips, modals, dropdowns, alerts, toastr, popovers, menus, and more</h4>

<p align="center">
 <a href="https://github.com/lokesh-coder/toppy/releases">
    <img src="https://img.shields.io/github/release/lokesh-coder/toppy.svg?style=flat-square&colorA=0C0B0C&colorB=2C282C" alt="Github Release">
  </a>
   <a href="LICENSE">
    <img src="https://img.shields.io/npm/l/toppy.svg?style=flat-square&colorA=0C0B0C&colorB=2C282C" alt="Licence">
  </a>
   <a href="#">
    <img src="https://img.shields.io/npm/dm/toppy.svg?style=flat-square&colorA=0C0B0C&colorB=2C282C" alt="Downloads">
  </a>
</p>
<br>

<div class="highlight highlight-source-shell">
<pre>
<div align="center"><strong >Demo and documentation</strong></div>
<div align="center"><a align="center" href="https://lokesh-coder.github.io/toppy/">https://lokesh-coder.github.io/toppy/</a></div>
</pre>
</div>

### Installation

**step 1:** Install from NPM or YARN

```sh
npm install toppy // or
yarn add toppy
```

**step 2:** Import `ToppyModule` in your main module

```typescript
import { ToppyModule } from 'toppy';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ToppyModule], // <==
  bootstrap: [AppComponent]
})
export class AppModule {}
```

**step 3:** Import `Toppy` service in your component

```typescript
import { Toppy } from 'toppy'; // <==

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

### Content

Toppy allows to use `string`, `html`, `TemplateRef`, `Component` as overlay content.

**Plain text**

```typescript
this.overlayIns = this._toppy
  .overlay(position)
  .host(`some plain text content`) // simple text
  .create();
```

**HTML content**

```typescript
this.overlayIns = this._toppy
  .overlay(position)
  .host(`<div>any HTML content</div>`, { hasHTML: true }) // html
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

**Component**

```typescript
// host component
@Component({
  template: '<div>Hello</div>'
})
export class HelloComponent {}
```

```typescript
this.overlayIns = this._toppy
  .overlay(position)
  .host(HelloComponent) // <==
  .create();
```

> Dont forget to add host component in `entryComponents` in module

### Positions

Position determines the location and size of the overlay. There are four positions:

**Relative position**

Overlay position that is relative to specific element. These are used in `tooltips`, `popovers`, `dropdowns`, `menus`

```typescript
new RelativePosition({
  src: HTMLElement, // target element
  placement: OutsidePlacement, // location of the content
  hostWidth: string | number, // content width eg, `auto`, 150, `30%`
  hostHeight: string | number, // content height eg, `auto`, 150, `30%`
  autoUpdate: boolean // update position when window scoll/resize
});
```

Relative position supports 12 placements:

```typescript
OutsidePlacement.BOTTOM;
OutsidePlacement.BOTTOM_LEFT;
OutsidePlacement.BOTTOM_RIGHT;
OutsidePlacement.LEFT;
OutsidePlacement.LEFT_BOTTOM;
OutsidePlacement.LEFT_TOP;
OutsidePlacement.RIGHT;
OutsidePlacement.RIGHT_BOTTOM;
OutsidePlacement.RIGHT_TOP;
OutsidePlacement.TOP;
OutsidePlacement.TOP_LEFT;
OutsidePlacement.TOP_RIGHT;
```

**Global position**

Overlay position that is relative to window viewport. These are used in `modals`, `alerts`, `toastr`

```typescript
new GlobalPosition({
  placement: InsidePlacement, // location of the content.
  hostWidth: string | number, // content width eg, `auto`, `150`, `30%`
  hostHeight: string | number, //content height eg, `auto`, 150, `30%`
  offset: number // oustide space of the content, in px
});
```

Global position supports 9 placements:

```typescript
InsidePlacement.BOTTOM;
InsidePlacement.BOTTOM_LEFT;
InsidePlacement.BOTTOM_RIGHT;
InsidePlacement.LEFT;
InsidePlacement.RIGHT;
InsidePlacement.TOP;
InsidePlacement.TOP_LEFT;
InsidePlacement.TOP_RIGHT;
InsidePlacement.CENTER;
```

**Slide position**

Overlay position that is relative to window viewport. These are used in `side panels`, `sidebars`, `blade`

```typescript
new SlidePosition({
  placement: SlidePlacement, // rigth or left
  width: string // width eg, '300px' or '30%'
});
```

Slide position supports 2 placements:

```typescript
SlidePlacement.LEFT;
SlidePlacement.RIGHT;
```

**Fullscreen position**

Overlay that occupies complete size of the viewport.

```typescript
new FullScreenPosition();
```

### Configuration

```typescript
this.toppy
  .overlay(position, configuration)
  .host('hello')
  .create();
```

| `property`                 | `default`           | `supported values` |
| -------------------------- | ------------------- | ------------------ |
| **backdrop**               | _false_             | boolean            |
| **containerClass**         | _'toppy-container'_ | string             |
| **wrapperClass**           | _'toppy-wrapper'_   | string             |
| **backdropClass**          | _'toppy-backdrop'_  | string             |
| **bodyClassNameOnOpen**    | _''_                | string             |
| **dismissOnDocumentClick** | _true_              | boolean            |
| **closeOnEsc**             | _false_             | boolean            |
| **parentElement**          | _null_              | HTMLElement        |
| **watchDocClick**          | _true_              | boolean            |
| **watchWindowResize**      | _true_              | boolean            |
| **windowResizeCallback**   | _null_              | function           |
| **docClickCallback**       | _null_              | function           |

### Component communication

When you host a component, you can control the overlay through `CurrentOverlay` service. As of now, this service has only one method called `close` to close the overlay from the host component. But, soon more API will be added to this service.

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

### API

> ```typescript
> Toppy.overlay(position:Position, config:ToppyConfig):Toppy
> ```

> ```typescript
> Toppy.host(
>   content: string | TemplateRef<any> | ComponentType<any>,
>   props: { [x: string]: any } = {}
> ):Toppy
> ```

> ```typescript
> Toppy.create(position:Position, config:ToppyConfig):ToppyRef
> ```

---

> ```typescript
> ToppyRef.open():void
> ```

> ```typescript
> ToppyRef.close():void
> ```

> ```typescript
> ToppyRef.toggle():void
> ```

> ```typescript
> ToppyRef.onDocumentClick():Observable
> ```

> ```typescript
> ToppyRef.onWindowResize():Observable
> ```

> ```typescript
> ToppyRef.getConfig():ToppyConfig
> ```

> ```typescript
> ToppyRef.updateHost(
>   content: string | TemplateRef<any> | ComponentType<any>,
>   props: { [x: string]: any } = {}
> ):ToppyRef
> ```

> ```typescript
> ToppyRef.updatePosition(config:object):ToppyRef
> ```

### Contribution

Any kind of contributions ( Typo fix, documentation, code quality, performance, refactor, pipeline, etc., ) are welcome. :)

### Issues

Found a bug? Have some idea? Or do you have questions? File it [here](https://github.com/lokesh-coder/toppy/issues)

### Licence

MIT
