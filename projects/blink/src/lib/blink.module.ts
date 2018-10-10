import { NgModule } from '@angular/core';

import { ComponentHost } from './host';
import { OverlayInstance } from './overlay-ins';
import { Blink } from './blink';
import { OverlayConfig } from './config';

@NgModule({
  providers: [ComponentHost, OverlayInstance, Blink, OverlayConfig]
})
export class BlinkModule {}
