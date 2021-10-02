import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import 'reflect-metadata'
import { plainToClass } from 'class-transformer';
import { CanData } from './canlines/shared/candata.model';
import { fromWorker } from 'observable-webworker';
import { of } from 'rxjs';
import { CanLine } from './canlines/shared/canline.model';

@Injectable({
  providedIn: 'root'
})
export class CanSerialService {

  constructor() { }

  private worker?: Worker;
  OnNewModel = new EventEmitter<CanData>();

  async start() {
    await (navigator as any).serial.requestPort();



    const input$ = of('Hello from main thread');

    fromWorker<string, CanLine>(() => new Worker('./app.worker', { type: 'module' }), input$).subscribe(message => {
      console.log(message); // Outputs 'Hello from webworker'
    });



    // if (this.worker === undefined) {
    //   this.worker = new Worker('./app.worker', { type: 'module' });
    //   this.worker.onmessage = ({ data }) => {
    //     let mappedData = plainToClass(CanData, data);
    //     this.OnNewModel.emit(mappedData);
    //   };
    // }
  }

  async stop() {
    this.worker?.terminate();
    this.worker = undefined;
  }
}