import { NgModule } from '@angular/core';

import { HostContainer } from './host-container';
import { OverlayInstance } from './overlay-instance';
import { Blink } from './blink';
import { OverlayConfig } from './overlay-config';

@NgModule({
  providers: [HostContainer, OverlayInstance, Blink, OverlayConfig]
})
export class BlinkModule {}
