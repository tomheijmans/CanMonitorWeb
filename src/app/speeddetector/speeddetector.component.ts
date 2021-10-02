import { Component, OnInit } from '@angular/core';
import { CanSerialService } from '../can-serial-service.service';
import { CanData } from '../canlines/shared/candata.model';
import { CanLine } from '../canlines/shared/canline.model';

@Component({
  selector: 'app-speeddetector',
  templateUrl: './speeddetector.component.html',
  styleUrls: ['./speeddetector.component.sass']
})
export class SpeeddetectorComponent implements OnInit {
 

  private minDataSet: Array<CanLine> = [];
  private maxDataSet: Array<CanLine> = [];

  constructor(private canSerialService : CanSerialService) {   }

  MinSpeed : number = 30;
  MaxSpeed : number = 50;
  PossibleRows : number[] = [];

  CanData : CanData = new CanData();


  ngOnInit(): void {
    this.canSerialService.OnNewModel.subscribe((value) => {
      this.CanData = value;
    });
  }

  setMinDataSet(): void {
    this.minDataSet = this.CanData.getCurrentState();
  }

  setMaxDataSet(): void {
    this.maxDataSet = this.CanData.getCurrentState();
  }

  tryFindValues(): void {
    const margin : number = 5;
    const bits : number = 8;

    this.PossibleRows = [];

    let expectedDif = 100 / this.MaxSpeed * this.MinSpeed;

    this.minDataSet.forEach(minRow => {
      let maxRow = this.maxDataSet.filter(x => x.id === minRow.id)[0];
      
      let maxValues = maxRow.getValues(bits);
      minRow.getValues(bits).forEach((minVal, index) => {
        let dif = 100 / maxValues[index] * minVal;
        if(dif >= expectedDif - margin && dif <= expectedDif + margin){
          this.PossibleRows.push(minRow.id);
        }
      });      
    });
  }
}
