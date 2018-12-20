import { Component } from '@angular/core';
import { ToppyOverlay } from 'toppy';

@Component({
  selector: 'app-hero-screen',
  templateUrl: './hero-screen.component.html',
  styles: []
})
export class HeroScreenComponent {
  constructor(public overlay: ToppyOverlay) {}
  dispose() {
    this.overlay.close();
  }
}
