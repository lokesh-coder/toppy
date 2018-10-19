import { Component, ViewChild, ElementRef } from '@angular/core';
import { Toppy, OutsidePlacement, RelativePosition, SlidePlacement } from 'toppy';
import { TestComponent } from './test/test.component';
import { code } from './codes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'toppy-app';
  @ViewChild('el', { read: ElementRef })
  el: ElementRef;
  ins;
  code = code;
  constructor(private _toppy: Toppy<TestComponent>) {}
  // ngOnInit() {
  //   console.log('what???', SlidePlacement.RIGHT);
  //   this.ins = this._toppy
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
