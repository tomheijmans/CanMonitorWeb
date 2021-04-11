import { CanLine } from "./canline.model";
import { Dictionary } from "./dictionary.model";

export class CanData {

  private values: Dictionary<Array<CanLine>>;
  constructor() {
    this.values = {};
  }

  addCanLine(canLine: CanLine) {
    let currentValue = this.values[canLine.id] ?? [];
    if (currentValue.length > 100) { // Keep only the last 100 rows for now
      currentValue.shift();
    }
    currentValue.push(canLine);
    this.values[canLine.id] = currentValue;
  }

  getKeys(): Array<string> {
    let keys: string[] = [];
    for (let key in this.values) {
      keys.push(key);
    }
    return keys;
  }

  getCanLinesForKey(key: string): Array<CanLine> {
    return this.values[key];
  }
}