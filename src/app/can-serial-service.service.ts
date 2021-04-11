import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import 'reflect-metadata'
import { plainToClass } from 'class-transformer';
import { CanData } from './canlines/shared/candata.model';

@Injectable({
  providedIn: 'root'
})
export class CanSerialService {

  constructor() { }

  private worker?: Worker;
  OnNewModel = new EventEmitter<CanData>();

  async start() {
    await (navigator as any).serial.requestPort();
    if (this.worker === undefined) {
      this.worker = new Worker('./app.worker', { type: 'module' });
      this.worker.onmessage = ({ data }) => {
        let mappedData = plainToClass(CanData, data);
        this.OnNewModel.emit(mappedData);
      };
    }
  }

  async stop() {
    this.worker?.terminate();
    this.worker = undefined;
  }
}