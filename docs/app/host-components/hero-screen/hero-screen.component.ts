import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-screen',
  templateUrl: './hero-screen.component.html',
  styles: []
})
export class HeroScreenComponent {
  close;
  dispose() {
    this.close();
  }
}
