import { Component, OnInit } from '@angular/core';
import { FullscreenPosition, Blink, BlinkRef } from 'blink';
import { HeroScreenComponent } from '../../host-components/hero-screen/hero-screen.component';

@Component({
  selector: 'app-fullscreen-position-example',
  templateUrl: './fullscreen-position-example.component.html',
  styles: []
})
export class FullscreenPositionExampleComponent implements OnInit {
  selectedPlacement = null;
  private _blinkRef: BlinkRef<HeroScreenComponent>;
  constructor(private blink: Blink<HeroScreenComponent>) {}

  ngOnInit() {}

  open() {
    if (this._blinkRef) {
      this._blinkRef.close();
    }
    this._blinkRef = this.blink
      .overlay(new FullscreenPosition())
      .host(HeroScreenComponent)
      .create();
    this._blinkRef.open();
  }

  onOptionChange() {
    console.log('option changed');
  }
}
