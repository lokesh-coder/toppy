import { Component, OnInit } from '@angular/core';
import { FullscreenPosition, Toppy, ToppyRef } from 'toppy';
import { HeroScreenComponent } from '../../host-components/hero-screen/hero-screen.component';

@Component({
  selector: 'app-fullscreen-position-example',
  templateUrl: './fullscreen-position-example.component.html',
  styles: []
})
export class FullscreenPositionExampleComponent implements OnInit {
  selectedPlacement = null;
  private _toppyRef: ToppyRef;
  constructor(private toppy: Toppy) {}

  ngOnInit() {
    this._toppyRef = this.toppy
      .overlay(new FullscreenPosition(), {
        closeOnEsc: true
      })
      .host(HeroScreenComponent)
      .create();
  }

  open() {
    this._toppyRef.open();
  }

  onOptionChange() {
    console.log('option changed');
  }
}
