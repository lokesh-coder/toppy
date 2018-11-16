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
