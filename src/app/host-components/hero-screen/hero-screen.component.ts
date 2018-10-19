import { Component, OnInit } from '@angular/core';
import { ToppyCurrentOverlay } from 'toppy';

@Component({
  selector: 'app-hero-screen',
  templateUrl: './hero-screen.component.html',
  styles: []
})
export class HeroScreenComponent {
  constructor(private overlay: ToppyCurrentOverlay) {}
  close() {
    this.overlay.close();
  }
}
