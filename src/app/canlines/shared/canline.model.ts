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

  public toString() {
    return this._values.join(" - ");
  }

  public static tryCreateFromSerialLine(line: string) {
    let values = line.split(";").map((x) => parseInt(x, 0)).filter(item => !isNaN(item));
    if (values.length === 9) {
      return new CanLine(values[0], values.slice(1));
    } else {
      return null;
    }
  }
}