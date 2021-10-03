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
    
    currentValue.rows.unshift(canLine);
    if (currentValue.rows.length > 20) { // Keep only the last rows for now
      currentValue.rows.pop();
    }
    this.upsertCanDataGroup(currentValue);
  }

  getCanLinesForKey(key: number): Array<CanLine> {
    return this.getCanDataGroupForKey(key)?.rows;
  }

  getCurrentState(): Array<CanLine>{
    let result: CanLine[] = [];
    this.values.forEach(value => {
      result.push(value.rows[value.rows.length -1]);
    });
    return result;
  }

  private getCanDataGroupForKey(key: number): CanDataGroup {
    return this.values.filter(value => value.key === key)[0] ?? null;
  }

  private upsertCanDataGroup(data: CanDataGroup) {
    this.values = this.values.filter(value => value.key !== data.key);
    this.values.push(data);
  }
}