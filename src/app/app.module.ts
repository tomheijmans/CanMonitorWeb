import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanlinesComponent } from './canlines/canlines.component';
import { SpeeddetectorComponent } from './speeddetector/speeddetector.component';

@NgModule({
  declarations: [
    AppComponent,
    CanlinesComponent,
    SpeeddetectorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
