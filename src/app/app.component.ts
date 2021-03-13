import { Component } from '@angular/core';
import { CanSerialService } from './can-serial-service.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'CanMonitorWeb';

  constructor(private canSerialService: CanSerialService) {
  }

  async onConnect() {
    await this.canSerialService.start();
  }

  async onStop() {
    await this.canSerialService.stop();
  }
}