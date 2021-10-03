import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ChartsModule } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanlinesComponent } from './canlines/canlines.component';
import { SpeeddetectorComponent } from './speeddetector/speeddetector.component';
import { DataviewComponent } from './dataview/dataview.component';
import { ChartviewComponent } from './chartview/chartview.component';


@NgModule({
  declarations: [
    AppComponent,
    CanlinesComponent,
    SpeeddetectorComponent,
    DataviewComponent,
    ChartviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
