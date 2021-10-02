import { Type } from "class-transformer";
import { CanLine } from "./canline.model";

export class CanDataGroup {
  key: number;

  @Type(() => CanLine)
  rows: CanLine[];

  constructor(key: number) {
    this.key = key;
    this.rows = [];
  }
}
