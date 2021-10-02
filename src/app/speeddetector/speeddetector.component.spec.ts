import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeeddetectorComponent } from './speeddetector.component';

describe('SpeeddetectorComponent', () => {
  let component: SpeeddetectorComponent;
  let fixture: ComponentFixture<SpeeddetectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeeddetectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeeddetectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
