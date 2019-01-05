import { Component, OnInit } from '@angular/core';
import { FullscreenPosition, Toppy, ToppyControl } from 'toppy';
import { HeroScreenComponent } from '../../host-components/hero-screen/hero-screen.component';

@Component({
  selector: 'app-fullscreen-position-example',
  templateUrl: './fullscreen-position-example.component.html'
})
export class FullscreenPositionExampleComponent implements OnInit {
  private _toppyControl: ToppyControl;
  constructor(private toppy: Toppy) {}

  ngOnInit() {
    this._toppyControl = this.toppy
      .position(new FullscreenPosition())
      .config({
        closeOnEsc: true
      })
      .content(HeroScreenComponent)
      .create();
    this._toppyControl.listen('t_compins').subscribe(d => {
      console.log('HeroScreenComponent initiated', d);
    });
  }

  open() {
    this._toppyControl.open();
  }
}
