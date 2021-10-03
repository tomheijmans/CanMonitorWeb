import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CanSerialService } from '../can-serial-service.service';
import { CanData } from '../shared/candata.model';
import { CanLine } from '../shared/canline.model';

@Component({
  selector: 'app-speeddetector',
  templateUrl: './speeddetector.component.html',
  styleUrls: ['./speeddetector.component.scss']
})
export class SpeeddetectorComponent implements OnInit, OnDestroy {

  private minDataSet: Array<CanLine> = [];
  private maxDataSet: Array<CanLine> = [];
  private subscription?: Subscription;

  constructor(private canSerialService : CanSerialService) {   }

  MinSpeed : number = 20;
  MaxSpeed : number = 50;
  PossibleRows : PossibleValue[] = [];

  CanData : CanData = new CanData();

  ValueToMononitor: PossibleValue  = new PossibleValue(34, "00000000", "00000000", 28, 40);

  ngOnInit(): void {
    this.subscription = this.canSerialService.getDataObservable().subscribe({
      next: (value) => this.CanData.addCanLine(value)
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }


  setMinDataSet(): void {
    this.minDataSet = this.CanData.getCurrentState();
  }

  setMaxDataSet(): void {
    this.maxDataSet = this.CanData.getCurrentState();
  }

  tryFindValues(): void {
    const tollerance : number = 2;
    const bitsMin : number = 8;
    const bitsMax : number = 16;

    this.PossibleRows = [];

    let expectedDif = 100 / this.MaxSpeed * this.MinSpeed;

    for(let bits = bitsMin; bits < bitsMax; bits++) {
      this.minDataSet.forEach(minRow => {
        let maxRow = this.maxDataSet.filter(x => x.id === minRow.id)[0];
        
        let maxValues = maxRow.getValues(bits);
        minRow.getValues(bits).forEach((minVal, index) => {
          let dif = 100 / maxValues[index].number * minVal.number;
          if(dif >= expectedDif - tollerance && dif <= expectedDif + tollerance){
            this.PossibleRows.push(new PossibleValue(minRow.id, minRow.asBinaryString(), maxRow.asBinaryString(), minVal.startIndex, minVal.endIndex));
          }
        });      
      });
    }
  }
}


export class PossibleValue {
  constructor(readonly id: number, readonly originalValueMin: string, readonly originalValueMax: string, readonly startIndex: number, readonly endIndex: number) {}
}