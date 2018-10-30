import { NgModule } from "@angular/core";
import { HostContainer } from "./host-container";
import { OverlayInstance } from "./overlay-instance";

@NgModule({
  providers: [HostContainer, OverlayInstance]
})
export class ToppyModule {}
