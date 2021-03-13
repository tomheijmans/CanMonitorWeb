/// <reference lib="webworker" />

class CanBusSerialReader {
  streamReader: ReadableStreamDefaultReader;
  textDecoder: TextDecoder;
  remainder: string = "";

  constructor(streamReader: ReadableStreamDefaultReader) {
    this.streamReader = streamReader;
    this.textDecoder = new TextDecoder();
  }

  async doWork() {
    postMessage("jsdlfksdjflsdf");
    let data;
    while (data = await this.streamReader.read()) {
      this.processNewData(data.value);
    }
  }

  processNewData(data: any) {
    let value = this.textDecoder.decode(data);
    let combined = this.remainder + value;
    combined.split("\r\n").forEach((line) => {
      if (line.split(";").length === 9) {
        postMessage(line);
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