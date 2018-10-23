import { Component, ElementRef, ViewChild } from '@angular/core';
import { Toppy } from 'toppy';
import { code } from './codes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'toppy-app';
  @ViewChild('el', { read: ElementRef })
  el: ElementRef;
  ins;
  code = code;
  constructor(private _toppy: Toppy) {}
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
