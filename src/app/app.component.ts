import { Component, OnInit } from '@angular/core';
import { ChildActivationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private worker?: Worker;

  title = 'CanMonitorWeb';

  async onConnect() {
    await (navigator as any).serial.requestPort();
    if (this.worker === undefined) {
      this.worker = new Worker('./app.worker', { type: 'module' });
      this.worker.onmessage = ({ data }) => {
        console.log(`page got message: ${data}`);
      };
    }
  }

  async onStop() {
    this.worker?.terminate();
    this.worker = undefined;
  }
}