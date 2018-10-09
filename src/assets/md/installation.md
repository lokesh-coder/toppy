## Installation

**`Step 1:`** You can install through `npm` or `yarn`

```powershell
npm install ngx-overlay --save
```

```powershell
yarn add ngx-overlay
```

**`Step 2:`** Add module in your angular app

```typescript
import { NgxOverlay } from 'ngx-overlay';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxOverlay],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

**`Step 3:`** Create overlay component

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  template: 'Hello, I am a tooltip'
})
export class TooltipComponent {}
```

**`Step 4:`** Add overlay component to entry components in module

```typescript
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxOverlay],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [TooltipComponent] // add here
})
export class AppModule {}
```

**`Step 5:`** Use Overlay in any component

```typescript
import { Component } from '@angular/core';
import { TooltipComponent } from '../path/to/tooltip.component';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <div #el>Click me</div>
    </div>
  `
})
export class AppComponent {
  @ViewChild('el', { read: ElementRef })
  el: ElementRef;

  constructor(private _overlay: Overlay<TooltipComponent>) {}

  ngOnInit() {
    const position = new RelativePosition({
      placement: OutsidePlacement.BOTTOM_LEFT,
      hostWidth: 'auto',
      hostHeight: 'auto',
      src: this.el.nativeElement
    });

    this.overlayIns = this._overlay
      .overlay(position)
      .host(TooltipComponent)
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
