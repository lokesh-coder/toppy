import { NgModule, InjectionToken, Injector } from '@angular/core';

import { ComponentHost } from './host';
import { DomHelper } from './helper/dom';
import { Messenger } from './helper/messenger';
import { BlinkRef } from './blink-ref';
import { OverlayInstance } from './overlay-ins';
import { Utils } from './helper/utils';
import { Blink } from './blink';
import { OverlayConfig } from './config';

@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [ComponentHost, OverlayInstance, DomHelper, Utils, Messenger, Blink, OverlayConfig]
})
export class BlinkModule {}
