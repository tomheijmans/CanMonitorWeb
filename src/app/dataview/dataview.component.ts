import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CanSerialService } from '../can-serial-service.service';
import { CanData } from '../shared/candata.model';
import { CanLine } from '../shared/canline.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dataview',
  templateUrl: './dataview.component.html',
  styleUrls: ['./dataview.component.scss']
})
export class DataviewComponent implements OnInit, OnDestroy {

  @Input() keyToMonitor?: number = undefined;
  @Input() allKeys: number[] = [];

  private valueSubscription?: Subscription;

  constructor(private canSerialService: CanSerialService) { }

  CanData: CanData = new CanData();

  ngOnInit(): void {
    this.valueSubscription = this.canSerialService.getDataObservable().subscribe({
      next: (value) => this.CanData.addCanLine(value)
    });
  }

  ngOnDestroy(): void {
    this.valueSubscription?.unsubscribe();
  }

  getDataToMonitor(): CanLine[] {
    if (this.keyToMonitor !== undefined) {
      return this.CanData.getCanLinesForKey(this.keyToMonitor);
    } else {
      return [];
    }
  }

  getCurrentDiff(): TextDiff[] {
    if (this.keyToMonitor !== undefined) {
      return this.getDiffForKey(this.keyToMonitor);
    } else {
      return [];
    }
  }

  getDiffsPerKey(): KeyTextDiff[] {
    let result : KeyTextDiff[] = [];
    this.allKeys.forEach(key => {
      result.push(new KeyTextDiff(key, this.getDiffForKey(key)));
    });
    return result;
  }

  getDiffForKey(key: number): TextDiff[]{
    let firstValues = this.CanData.getCanLinesForKey(key)?.slice(0, 2) ?? [];
    return this.createDiff(firstValues[0]?.asBinaryString() ?? "", firstValues[1]?.asBinaryString() ?? "");
  }

  private createDiff(newValue: string, oldValue: string): TextDiff[] {
    let result: TextDiff[] = [];
    newValue.split('').forEach(function (val, i) {
      if (val !== oldValue.charAt(i)) {
        result.push(new TextDiff(val, true));
      } else {
        result.push(new TextDiff(val, false));
      }
    });

    return result;
  }
}

export class KeyTextDiff {
  constructor(readonly key: number, readonly diff: TextDiff[]) { }
}

export class TextDiff {
  constructor(readonly value: string, readonly isDiff: boolean) { }
}
