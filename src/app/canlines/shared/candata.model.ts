import 'reflect-metadata'
import { Type } from "class-transformer";
import { CanLine } from "./canline.model";
import { CanDataGroup } from './candatagroup.model';

export class CanData {

  @Type(() => CanDataGroup)
  private values: CanDataGroup[];
  constructor() {
    this.values = [];
  }

  addCanLine(canLine: CanLine) {
    let currentValue = this.getCanDataGroupForKey(canLine.id) ?? new CanDataGroup(canLine.id);
    if (currentValue.rows.length > 100) { // Keep only the last 100 rows for now
      currentValue.rows.shift();
    }
    currentValue.rows.push(canLine);
    this.upsertCanDataGroup(currentValue);
  }

  getKeys(): Array<number> {
    let keys: number[] = [];
    for (let index in this.values) {
      keys.push(this.values[index].key);
    }
    return keys.sort((n1,n2) => n1 - n2);
  }

  getCanLinesForKey(key: number): Array<CanLine> {
    return this.getCanDataGroupForKey(key)?.rows;
  }

  private getCanDataGroupForKey(key: number): CanDataGroup {
    return this.values.filter(value => value.key === key)[0] ?? null;
  }

  private upsertCanDataGroup(data: CanDataGroup) {
    this.values = this.values.filter(value => value.key !== data.key);
    this.values.push(data);
  }
}