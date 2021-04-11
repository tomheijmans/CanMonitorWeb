/// <reference lib="webworker" />

import { CanData } from "./canlines/shared/candata.model";
import { CanLine } from "./canlines/shared/canline.model";

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

(navigator as any).serial.getPorts().then(async (ports: any) => {
  await ports[0].open({ baudRate: 115200 });
  new CanBusSerialReader(ports[0].readable.getReader()).doWork();
});