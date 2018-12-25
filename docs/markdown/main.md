### [ ]{.toppy-icon .icon-terminal} Installation

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

### [ ]{.toppy-icon .icon-tag} Content types

**Plain text**

```typescript
this.overlay = this._toppy
  .position(position)
  .content(`some plain text content`) // simple text
  .create();
```

**Using html**

```typescript
this.overlay = this._toppy
  .position(position)
  .content(`<div>any HTML content</div>`, { hasHTML: true }) // html
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
this.overlay = this._toppy
  .position(position)
  .content(HelloComponent) // host a component
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

### [ ]{.toppy-icon .icon-navigation} Positions

##### Realtive position

<app-relative-position-example></app-relative-position-example>

```typescript
new RelativePosition({
  src: HTMLElement, // target element
  placement: OutsidePlacement, // location of the content
  width: string | number, // content width eg, `auto`, 150, `100%`
  height: string | number, // content height eg, `auto`, 150, `100%`
  autoUpdate: boolean // update position when window scroll/resize/drag
});
```

##### Global position

<app-global-position-example></app-global-position-example>

```typescript
new GlobalPosition({
  placement: InsidePlacement, // location of the content.
  width: string | number, // content width eg, `auto`, 150, `100%`
  height: string | number, //content height eg, `auto`, 150, `100%`
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

### [ ]{.toppy-icon .icon-rss} Communication

##### Component Data

When you host a component, you can control the overlay through `ToppyOverlay` service. Using this service you can access all properties that is provided in content. Also the properties comes with `close`.

```typescript
this.overlay = this._toppy
  .position(position)
  .content(HelloComponent, { propName: 'toppy-test-prop' })
  .create();
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

##### Template Data

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

##### Plain text

When you use Plain text as a content, optionally you can able to set a class name to that `div` block.

```typescript
this.overlay = this._toppy
  .position(position)
  .content('some content', { class: 'tooltip' })
  .create();
```

### [ ]{.toppy-icon .icon-zap} Examples

##### 1. Stick content on dragging

In below example you can see that the tooltip content is sticked with the `src` element in `RelativePosition`

<app-drag-example></app-drag-example>

##### 2. Dynamic text content

When the provided content is just a string, you can update that content dynamically while the overlay is open.

<app-dynamic-text-example></app-dynamic-text-example>

##### 3. Modal content

Simple modal example shows center aligned templateRef content. Click Escape to close.

<app-modal-example></app-modal-example>

##### 4. Dropdown selector

Custom dropdown example

<app-dropdown-example></app-dropdown-example>

##### 5. Global Ribbon

Footer ribbon example

<app-ribbon-example></app-ribbon-example>

##### 6. Control toppy

You can actually control any toppy overlays from anywhere in the application. Clicking the below button will open the previous example (Dropdown selector) dropdown.

<app-control-example></app-control-example>

### [ ]{.toppy-icon .icon-settings} Configuration

```typescript
// config
this.toppy
  .position(position: ToppyPosition)
  .config(configuration: ToppyConfig = {})
  .content('hello')
  .create();
```

| `property`               | `for`                                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| **backdrop**             | `boolean` &middot; whether to show backdrop layer &middot; `default`: _false_            |
| **closeOnEsc**           | `boolean` &middot; clicking Escape button will close overlay &middot; `default`: _false_ |
| **closeOnDocClick**      | `boolean` &middot; dismiss on clicking outside of content &middot; `default`: _false_    |
| **listenWindowEvents**   | `boolean` &middot; auto adjust the position on scroll/resize &middot; `default`: _true_  |
| **containerClass**       | `string` &middot; overlay container class name &middot; `default`: _t-overlay_           |
| **wrapperClass**         | `string` &middot; overlay wrapper class name &middot; `default`: _''_                    |
| **backdropClass**        | `string` &middot; overlay backdrop class name &middot; `default`: _''_                   |
| **bodyClass**            | `string` &middot; body class when overlay is open &middot; `default`: _t-open_           |
| **windowResizeCallback** | `function` &middot; triggered on window scroll                                           |
| **docClickCallback**     | `function` &middot; triggered on document click                                          |

### [ ]{.toppy-icon .icon-file} API

```typescript

/* Toppy */

Toppy.position(position: ToppyPosition):Toppy

Toppy.config(config: ToppyConfig):Toppy

Toppy.content(data: ContentData, props: ContentProps = {}):Toppy

Toppy.create(key: string = ''):ToppyControl

Toppy.getCtrl(id: string):ToppyControl

Toppy.destroy():void
```

---

```typescript

/* ToppyControl */

ToppyControl.open():void

ToppyControl.close():void

ToppyControl.toggle():void

ToppyControl.onDocumentClick():Observable<any>

ToppyControl.onWindowResize():Observable<any>

ToppyControl.changePosition(newPosition: ToppyPosition): void

ToppyControl.updateContent(content: ContentData, props: ContentProps = {}):void

ToppyControl.updatePosition(config: object):ToppyControl

ToppyControl.listen(eventName: ToppyEventName):Observable<any>
```

---

```typescript
type ToppyEventName
```

<div class="inline-code">

```typescript
't_open';
```

```typescript
't_close';
```

```typescript
't_dynpos';
```

```typescript
't_detach';
```

```typescript
't_posupdate';
```

</div>

---

```typescript
enum OutsidePlacement {}
```

<div class="inline-code">

```typescript
OutsidePlacement.BOTTOM;
```

```typescript
OutsidePlacement.LEFT;
```

```typescript
OutsidePlacement.TOP;
```

```typescript
OutsidePlacement.RIGHT;
```

```typescript
OutsidePlacement.BOTTOM_LEFT;
```

```typescript
OutsidePlacement.BOTTOM_RIGHT;
```

```typescript
OutsidePlacement.LEFT_BOTTOM;
```

```typescript
OutsidePlacement.LEFT_TOP;
```

```typescript
OutsidePlacement.RIGHT_BOTTOM;
```

```typescript
OutsidePlacement.RIGHT_TOP;
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
InsidePlacement.TOP;
```

```typescript
InsidePlacement.BOTTOM;
```

```typescript
InsidePlacement.TOP_RIGHT;
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
InsidePlacement.TOP_LEFT;
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

### [ ]{.toppy-icon .icon-hash} More

##### Contribution

Any kind of contributions ( Typo fix, documentation, code quality, performance, refactor, pipeline, etc., ) are welcome. 😊

##### Credits

Icon imagess are from [openmoji](http://openmoji.org)

##### Issues

Found a bug? Have some idea? Or do you have questions? File it in [github issues](https://github.com/lokesh-coder/toppy/issues)

##### License

MIT

<br/>
