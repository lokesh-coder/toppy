import { Injectable } from '@angular/core';
import { Config } from './models';

export function ConfigFactory() {
  return new OverlayConfig();
}

@Injectable({
  providedIn: 'root',
  useFactory: ConfigFactory
})
export class OverlayConfig implements Config {
  backdrop = false;
  backdropClass = 'blink-backdrop';
  containerClass = 'blink-container';
  dismissOnDocumentClick = true;
  hostContainerClass: 'blink-host-container';
  parentElement = null;
  watchDocClick = true;
  watchWindowResize = true;
  windowResizeCallback() {}
  docClickCallback() {}
  set(config: Partial<Config>) {
    // tslint:disable-next-line:forin
    for (const c in config) {
      this[c] = config[c];
    }
  }
}
