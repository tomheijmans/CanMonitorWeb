import { Component, Input, OnInit } from '@angular/core';
import { CanSerialService } from '../can-serial-service.service';
import { CanData } from '../CanLinesModel';

@Component({
  selector: 'app-canlines',
  templateUrl: './canlines.component.html',
  styleUrls: ['./canlines.component.sass']
})
export class CanlinesComponent implements OnInit {
  // ?@Input() model : CanData;
  // canLines: CanLinesModel= {
  //   id: 1,
  //   name : "sdf"
  // }

  constructor(private canSerialService : CanSerialService) { }

  MyAwesomeProp : CanData = new CanData();

  ngOnInit(): void {
    this.canSerialService.OnNewModel.subscribe((value) => {
      this.MyAwesomeProp = value;
    });
  }

}
