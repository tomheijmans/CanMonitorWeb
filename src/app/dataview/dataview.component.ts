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

  @Input() keyToMonitor: number = 0;

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
    return this.CanData.getCanLinesForKey(this.keyToMonitor);
  }
}
