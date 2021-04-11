import { Component, OnInit } from '@angular/core';
import { CanSerialService } from '../can-serial-service.service';
import { CanData } from './shared/candata.model';
import { CanLine } from './shared/canline.model';

@Component({
  selector: 'app-canlines',
  templateUrl: './canlines.component.html',
  styleUrls: ['./canlines.component.scss']
})
export class CanlinesComponent implements OnInit {
  
  constructor(private canSerialService : CanSerialService) { }

  CanData : CanData = new CanData();
  CurrentKeyToMonitor : number = 0;

  ngOnInit(): void {
    this.canSerialService.OnNewModel.subscribe((value) => {
      this.CanData = value;
    });
  }

  getDataToMonitor () : CanLine[] {
    return this.CanData.getCanLinesForKey(this.CurrentKeyToMonitor);
  }
}
