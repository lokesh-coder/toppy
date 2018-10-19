import { NgModule } from '@angular/core';

import { HostContainer } from './host-container';
import { OverlayInstance } from './overlay-instance';
import { Toppy } from './toppy';
import { OverlayConfig } from './overlay-config';

@NgModule({
  providers: [HostContainer, OverlayInstance, Toppy, OverlayConfig]
})
export class ToppyModule {}
