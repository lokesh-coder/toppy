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

**step 1:** Install from [npm](https://www.npmjs.com/package/toppy) or [yarn](https://yarnpkg.com/en/package/toppy)

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

    this.overlay = this._toppy
      .position(position)
      .content('hello') // content
      .create();
  }

  open() {
    this.overlay.open();
  }

  close() {
    this.overlay.close();
  }
}
```

### Content

Toppy allows to use `string`, `html`, `TemplateRef`, `Component` as overlay content.

**Plain text**

```typescript
this.overlay = this._toppy
  .position(position)
  .content(`some plain text content`) // simple text
  .create();
```

**HTML content**

```typescript
this.overlay = this._toppy
  .position(position)
  .content(`<div>any HTML content</div>`, { hasHTML: true }) // html
  .create();
```

**Using TemplateRef**

```html
<ng-template #tpl>Hello world!</ng-template>
```

```typescript
@ViewChild('tpl') tpl:TemplateRef<any>;

this.overlay = this._toppy
  .position(position)
  .content(this.tpl) // template ref
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
this.overlay = this._toppy
  .position(position)
  .content(HelloComponent) // <==
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
  width: string | number, // content width eg, `auto`, 150, `30%`
  height: string | number, // content height eg, `auto`, 150, `30%`
  autoUpdate: boolean // update position when window scroll/resize/drag
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
  width: string | number, // content width eg, `auto`, `150`, `30%`
  height: string | number, //content height eg, `auto`, 150, `30%`
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
  .position(position: ToppyPosition)
  .config(configuration: ToppyConfig = {})
  .content('hello')
  .create();
```

| `property`               | `for`                                                                                  |
| ------------------------ | -------------------------------------------------------------------------------------- |
| **backdrop**             | `boolean` &middot; whether to show backdrop layer &middot; default: `false`            |
| **closeOnEsc**           | `boolean` &middot; clicking Escape button will close overlay &middot; default: `false` |
| **closeOnDocClick**      | `boolean` &middot; dismiss on clicking outside of content &middot; default: `false`    |
| **listenWindowEvents**   | `boolean` &middot; auto adjust the position on scroll/resize &middot; default: `true`  |
| **containerClass**       | `string` &middot; overlay container class name &middot; default: `t-overlay`           |
| **wrapperClass**         | `string` &middot; overlay wrapper class name &middot; default: `''`                    |
| **backdropClass**        | `string` &middot; overlay backdrop class name &middot; default: `''`                   |
| **bodyClass**            | `string` &middot; body class when overlay is open &middot; default: `t-open`           |
| **windowResizeCallback** | `function` &middot; triggered on window scroll                                         |
| **docClickCallback**     | `function` &middot; triggered on document click                                        |

### Component communication

#### Component Data

When you host a component, you can control the overlay through `ToppyOverlay` service. Using this service you can access all properties that is provided in content. Also the properties comes with `close`.

```typescript
this.overlay = this._toppy
  .position(position)
  .content(HelloComponent, { propName: 'toppy-test-prop' })
  .create();

this.overlay.listen('t_compins').subscribe(comp => {
  console.log('component is ready!', comp); // returns HelloComponent
});
```

```typescript
// host component
@Component({
  template: '<div>Some text</div>'
})
export class HelloComponent {
  constructor(public overlay: ToppyOverlay) {
    console.log(this.overlay.props.propName); // will return 'toppy-test-prop'
  }

  close() {
    this.overlay.close();
  }
}
```

#### Template Data

This is very similar to above one. When you use template as a content, you can pass additional data to it.

```typescript
this.overlay = this._toppy
  .position(position)
  .content(template, { name: 'Johny' })
  .create();
```

Then in your template you can refer the data like this,

```html
<ng-template #tpl let-toppy>
  <div>Hello <span [innerText]="toppy.name"></span> !</div>
  <button (click)="toppy.close()">Close</button>
</ng-template>
```

Method `close` is automatically binded.

#### Plain text

When you use Plain text as a content, optionally you can able to set a class name to that `div` block.

```typescript
this.overlay = this._toppy
  .position(position)
  .content('some content', { class: 'tooltip' })
  .create();
```

### API

```typescript

/* Toppy */

Toppy.position(position: ToppyPosition):Toppy

Toppy.config(config: ToppyConfig):Toppy

Toppy.content(data: ContentData, props: ContentProps = {}):Toppy

Toppy.create(key: string = ''):ToppyControl

Toppy.getCtrl(id: string):ToppyControl

Toppy.destroy():void
```

```typescript

/* ToppyControl */

ToppyControl.open():void

ToppyControl.close():void

ToppyControl.toggle():void

ToppyControl.onDocumentClick():Observable<any>

ToppyControl.onWindowResize():Observable<any>

ToppyControl.changePosition(newPosition: ToppyPosition): void

ToppyControl.updateContent(content: ContentData, props: ContentProps = {}):void

ToppyControl.updatePosition(config:object):ToppyControl

ToppyControl.listen(eventName:string):Observable<any>
```

```typescript
/* events */

`t_open`, `t_close`, `t_dynpos`, `t_detach`, `t_posupdate`, `t_compins`;
```

### Contribution

Any kind of contributions ( Typo fix, documentation, code quality, performance, refactor, pipeline, etc., ) are welcome. :)

### Credits

▶ Icons ━ [icons8](https://icons8.com/icons/cotton)

▶ Illustrations ━ [undraw](https://undraw.co/illustrations)

▶ Font icons ━ [feathers](https://feathericons.com)

### Issues

Found a bug? Have some idea? Or do you have questions? File it [here](https://github.com/lokesh-coder/toppy/issues)

### Licence

MIT
