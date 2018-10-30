## Installation

**`Step 1:`** You can install through `npm` or `yarn`

```powershell
npm install @overlay/core --save
```

```powershell
yarn add @overlay/core
```

**`Step 2:`** Add module in your angular app

```typescript
import { OverlayModule } from '@overlay/core';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, OverlayModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

**`Step 3:`** Use Overlay in any component

```typescript
@Component({
  selector: 'app-root',
  template: '<div #el>Click me</div>'
})
export class AppComponent {
  @ViewChild('el', { read: ElementRef })
  el: ElementRef;

  constructor(private _overlay: Overlay) {}

  ngOnInit() {
    const position = new RelativePosition({
      placement: OutsidePlacement.BOTTOM_LEFT,
      src: this.el.nativeElement
    });

    this.overlayIns = this._overlay.overlay(position).create('hello');
  }
  open() {
    this.overlayIns.open();
  }
  close() {
    this.overlayIns.close();
  }
}
```
