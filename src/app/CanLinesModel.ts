
export interface Dictionary<T> {
  [Key: string]: T;
}

export class CanLine {
  private _id: number;
  private _values: Array<number>;
  constructor(id: number, values: Array<number>) {
    this._id = id;
    this._values = values;
  }

  public get id() {
    return this._id;
  }

  public static tryCreateFromSerialLine(line: string) {
    let values = line.split(";").map((x) => parseInt(x, 0)).filter(item=> !isNaN(item));
    if (values.length === 9) {
      return new CanLine(values[0], values.slice(1));
    } else {
      return null;
    }
  }
}

export class CanData {
  private values: Dictionary<Array<CanLine>>;
  constructor() {
    this.values = {};
  }

  public get lastValue() {
    if (this.values[0]) {
      return this.values[0][this.values[0].length - 1];
    } else {
      return 0;
    }
  }

  addCanLine(canLine: CanLine) {
    let currentValue = this.values[canLine.id] ?? [];
    if (currentValue.length > 100) {
      currentValue.shift();
    }
    currentValue.push(canLine);
    this.values[canLine.id] = currentValue;
  }
}