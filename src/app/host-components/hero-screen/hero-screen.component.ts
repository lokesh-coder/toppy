import { Component } from '@angular/core';
import { CurrentOverlay } from 'toppy';

@Component({
  selector: 'app-hero-screen',
  templateUrl: './hero-screen.component.html',
  styles: []
})
export class HeroScreenComponent {
  constructor(private overlay: CurrentOverlay) {}
  close() {
    this.overlay.close();
  }
}
