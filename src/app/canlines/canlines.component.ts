import { Component, OnDestroy, OnInit } from '@angular/core';
import { CanSerialService } from '../can-serial-service.service';
import { CanData } from '../shared/candata.model';
import { CanLine } from '../shared/canline.model';
import { distinct, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-canlines',
  templateUrl: './canlines.component.html',
  styleUrls: ['./canlines.component.scss']
})
export class CanlinesComponent implements OnInit, OnDestroy {

  private keySubscription?: Subscription;
  
  constructor(private canSerialService : CanSerialService) { }

  CanData : CanData = new CanData();
  CurrentKeyToMonitor : number = 0;
  Keys: number[] = [];

  ngOnInit(): void {
    this.keySubscription = this.canSerialService.getDataObservable().pipe(
      map((canLine: CanLine) => canLine.id),
      distinct((id: number) => id),
    ).subscribe(id => {
      this.Keys.push(id);
      this.Keys.sort((n1,n2) => n1 - n2);
    });

    this.canSerialService.getDataObservable().subscribe({
      next: (value) => this.CanData.addCanLine(value)
    });
  }

  ngOnDestroy(): void {
    this.keySubscription?.unsubscribe();
  }

  getDataToMonitor () : CanLine[] {
    return this.CanData.getCanLinesForKey(this.CurrentKeyToMonitor);
  }
}
