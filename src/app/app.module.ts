import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BlinkModule } from 'blink';
import { TestComponent } from './test/test.component';
import { SectionComponent } from './utils/section/section.component';

@NgModule({
  declarations: [AppComponent, TestComponent, SectionComponent],
  imports: [BrowserModule, BlinkModule],
  providers: [],
  entryComponents: [TestComponent],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule {}
