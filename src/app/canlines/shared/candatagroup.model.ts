import { Type } from "class-transformer";
import { CanLine } from "./canline.model";

export class CanDataGroup {
  key: string;

  @Type(() => CanLine)
  rows: CanLine[];

  constructor(key: string) {
    this.key = key;
    this.rows = [];
  }
}
