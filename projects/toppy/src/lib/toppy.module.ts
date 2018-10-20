import { NgModule } from '@angular/core';
import { Config } from './config';
import { HostContainer } from './host-container';
import { OverlayInstance } from './overlay-instance';
import { Toppy } from './toppy';

@NgModule({
  providers: [HostContainer, OverlayInstance, Toppy, Config]
})
export class ToppyModule {}
