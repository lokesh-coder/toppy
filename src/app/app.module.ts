import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BlinkModule } from 'blink';
import { TestComponent } from './test/test.component';

@NgModule({
  declarations: [AppComponent, TestComponent],
  imports: [BrowserModule, BlinkModule],
  providers: [],
  entryComponents: [TestComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
