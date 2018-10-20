import { Injectable } from '@angular/core';
import { BaseConfig } from './models';

export function ConfigFactory() {
  return new Config();
}

@Injectable({
  providedIn: 'root',
  useFactory: ConfigFactory
})
export class Config implements BaseConfig {
  backdrop = false;
  backdropClass = 'toppy-backdrop';
  containerClass = 'toppy-container';
  dismissOnDocumentClick = true;
  hostContainerClass: 'toppy-host-container';
  parentElement = null;
  watchDocClick = true;
  watchWindowResize = true;
  windowResizeCallback() {}
  docClickCallback() {}
  set(config: Partial<BaseConfig>) {
    // tslint:disable-next-line:forin
    for (const configName in config) {
      this[configName] = config[configName];
    }
  }
}
