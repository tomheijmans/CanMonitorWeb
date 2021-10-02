/// <reference lib="webworker" />

import { CanData } from "./canlines/shared/candata.model";
import { CanLine } from "./canlines/shared/canline.model";
import { DoWork, runWorker } from 'observable-webworker';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

class CanBusSerialReader {
  streamReader: ReadableStreamDefaultReader;
  textDecoder: TextDecoder;
  remainder: string = "";
  canData: CanData;

  constructor(streamReader: ReadableStreamDefaultReader) {
    this.streamReader = streamReader;
    this.textDecoder = new TextDecoder();
    this.canData = new CanData();
  }

  async doWork() {
    let data;
    while (data = await this.streamReader.read()) {
      this.processNewData(data.value);
      postMessage(this.canData);
      await this.delay(200);
    }
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  processNewData(data: any) {
    let value = this.textDecoder.decode(data);
    let combined = this.remainder + value;
    combined.split("\r\n").forEach((line) => {
      let canLine = CanLine.tryCreateFromSerialLine(line);
      if (canLine !== null) {
        this.canData.addCanLine(canLine);
      } else {
        this.remainder = line;
      }
    });
  }
}

export class SerialWorker implements DoWork<string, CanLine> {

  private _dataStream = new Subject<CanLine>();
  streamReader: ReadableStreamDefaultReader;
  textDecoder: TextDecoder;
  remainder: string = "";
  // canData: CanData;

  constructor(streamReader: ReadableStreamDefaultReader) {
    this.streamReader = streamReader;
    this.textDecoder = new TextDecoder();
    // this.canData = new CanData();
  }

  
  public work(input$: Observable<string>): Observable<CanLine> {

    (navigator as any).serial.getPorts().then(async (ports: any) => {
      await ports[0].open({ baudRate: 115200 });
      this.streamReader = ports[0].readable.getReader();
      this.doWork();
    });
    return this._dataStream;
    
    // input$.pipe(
    //   map(message => {
    //     console.log(message); // outputs 'Hello from main thread'
    //     return `Hello from webworker`;
    //   }),
    // );
  }

  async doWork() {
    let data;
    while (data = await this.streamReader.read()) {
      this.processNewData(data.value);    
      // postMessage(this.canData);
      await this.delay(200);
    }
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  processNewData(data: any) {
    let value = this.textDecoder.decode(data);
    let combined = this.remainder + value;
    combined.split("\r\n").forEach((line) => {
      let canLine = CanLine.tryCreateFromSerialLine(line);
      if (canLine !== null) {
        this._dataStream.next(canLine);

        // this.canData.addCanLine(canLine);
      } else {
        this.remainder = line;
      }
    });
  }
}

// (navigator as any).serial.getPorts().then(async (ports: any) => {
//   await ports[0].open({ baudRate: 115200 });
//   new CanBusSerialReader(ports[0].readable.getReader()).doWork();
// });

runWorker(SerialWorker);