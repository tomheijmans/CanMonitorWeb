import { Component, Input, OnInit } from '@angular/core';
import { plainToClass } from 'class-transformer';
import { CanSerialService } from '../can-serial-service.service';
import { CanData } from '../CanLinesModel';

@Component({
  selector: 'app-canlines',
  templateUrl: './canlines.component.html',
  styleUrls: ['./canlines.component.sass']
})
export class CanlinesComponent implements OnInit {
  
  constructor(private canSerialService : CanSerialService) { }

  CanData : CanData = new CanData();

  ngOnInit(): void {
    this.canSerialService.OnNewModel.subscribe((value) => {
      this.CanData = plainToClass(CanData, value);
    });
  }
}
