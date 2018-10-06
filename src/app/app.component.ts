import { Component, ViewChild, ElementRef } from '@angular/core';
import { Blink, OutsidePlacement, RelativePosition, SlidePlacement } from 'blink';
import { TestComponent } from './test/test.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'blink-app';
  @ViewChild('el', { read: ElementRef })
  el: ElementRef;
  ins;
  constructor(private _blink: Blink<TestComponent>) {}
  // ngOnInit() {
  //   console.log('what???', SlidePlacement.RIGHT);
  //   this.ins = this._blink
  //     .overlay(
  //       new RelativePosition({
  //         placement: OutsidePlacement.BOTTOM_LEFT,
  //         hostWidth: 'auto',
  //         hostHeight: 'auto',
  //         src: this.el.nativeElement
  //       })
  //     )
  //     .host(TestComponent)
  //     .create();
  // }
  // open() {
  //   this.ins.open();
  // }
  // close() {
  //   this.ins.close();
  // }
}
