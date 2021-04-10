import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanlinesComponent } from './canlines.component';

describe('CanlinesComponent', () => {
  let component: CanlinesComponent;
  let fixture: ComponentFixture<CanlinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanlinesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanlinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
