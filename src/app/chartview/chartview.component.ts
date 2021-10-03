import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { filter, map, scan } from 'rxjs/operators';
import { CanSerialService } from '../can-serial-service.service';
import { CanLine } from '../shared/canline.model';
import { PossibleValue } from '../speeddetector/speeddetector.component';

@Component({
  selector: 'app-chartview',
  templateUrl: './chartview.component.html',
  styleUrls: ['./chartview.component.scss']
})
export class ChartviewComponent implements OnInit, OnDestroy {

  private subscription?: Subscription;

  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99'];
  public lineChartOptions: (ChartOptions & { annotation?: any }) = {
    responsive: true,
    animation: {
      duration: 0
    }, 
    layout: {}
  };

  public lineChartType: ChartType = 'line';

  @Input() valueToMonitor: PossibleValue = new PossibleValue(32, "00000000", "00000000", 40, 56);

  constructor(private canSerialService: CanSerialService) { }

  ngOnInit(): void {

    this.subscription = this.canSerialService.getDataObservable().pipe(
      filter((canLine: CanLine) => canLine.id === this.valueToMonitor.id),
      map((canLine: CanLine) => parseInt(canLine.asBinaryString().substring(this.valueToMonitor.startIndex, this.valueToMonitor.endIndex), 2)),
      scan((acc: number[], val: number) => {
        acc.push(val);
        return acc.slice(-100);
      }, []),
      map<number[], ChartDataSets>((value: number[]) => {
         return { 
           data: value, 
           label: (this.valueToMonitor?.id || 0).toString() + " " + this.valueToMonitor.startIndex.toString() + " " + this.valueToMonitor.endIndex.toString() }; 
          })
    ).subscribe((value: ChartDataSets) => {
      this.lineChartData = [value];
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
