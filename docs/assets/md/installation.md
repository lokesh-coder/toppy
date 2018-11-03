## Installation

**`Step 1:`** You can install through [npm](https://www.npmjs.com/package/toppy) or [yarn](https://yarnpkg.com/en/package/toppy)

```powershell
npm install toppy --save
```

```powershell
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

###### Simple text

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
      .host('hello') // simple text
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

###### Using html

```typescript
this.overlayIns = this._toppy
  .overlay(position)
  .host(`<div>any HTML content</div>`, { hasHTML: true }) // html
  .create();
```

###### Using component

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

###### Using TemplateRef

```html
<div #tpl>Hello world!</div>
```

```typescript
@ViewChild('tpl') tpl:TemplateRef<any>;

this.overlayIns = this._toppy
  .overlay(position)
  .host(this.tpl) // template ref
  .create();
```
