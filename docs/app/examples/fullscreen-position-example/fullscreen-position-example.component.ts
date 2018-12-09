import { Component, OnInit } from '@angular/core';
import { FullscreenPosition, Toppy, ToppyControl } from 'toppy';
import { HeroScreenComponent } from '../../host-components/hero-screen/hero-screen.component';

@Component({
  selector: 'app-fullscreen-position-example',
  templateUrl: './fullscreen-position-example.component.html',
  styles: []
})
export class FullscreenPositionExampleComponent implements OnInit {
  selectedPlacement = null;
  private _toppyControl: ToppyControl;
  constructor(private toppy: Toppy) {}

  ngOnInit() {
    this._toppyControl = this.toppy
      .position(new FullscreenPosition())
      .config({
        closeOnEsc: true
      })
      .content(HeroScreenComponent)
      .execute();
  }

  open() {
    this._toppyControl.open();
  }

  onOptionChange() {
    console.log('option changed');
  }
}
