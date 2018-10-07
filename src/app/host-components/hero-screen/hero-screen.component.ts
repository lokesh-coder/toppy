import { Component, OnInit } from '@angular/core';
import { BlinkCurrentOverlay } from 'blink';

@Component({
  selector: 'app-hero-screen',
  templateUrl: './hero-screen.component.html',
  styles: []
})
export class HeroScreenComponent {
  constructor(private overlay: BlinkCurrentOverlay) {}
  close() {
    this.overlay.close();
  }
}
