import { Injectable } from '@angular/core';
import 'reflect-metadata'
import { plainToClass } from 'class-transformer';
import { CanLine } from './canlines/shared/canline.model';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CanSerialService {

  constructor() { }

  private dataStream = new Subject<CanLine>();
  private worker?: Worker;

  async start() {
    await (navigator as any).serial.requestPort();
    if (this.worker === undefined) {
      this.worker = new Worker('./app.worker', { type: 'module' });
      this.worker.onmessage = ( data : MessageEvent<CanLine>) => {
        this.dataStream.next(plainToClass(CanLine, data.data));
      };
    }
  }

  getDataObservable () : Observable<CanLine> {
    return this.dataStream;
  }

  async stop() {
    this.worker?.terminate();
    this.worker = undefined;
  }
}