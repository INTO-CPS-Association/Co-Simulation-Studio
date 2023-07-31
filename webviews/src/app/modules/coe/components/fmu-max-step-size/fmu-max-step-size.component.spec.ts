import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FmuMaxStepSizeComponent } from './fmu-max-step-size.component';

describe('FmuMaxStepSizeComponent', () => {
  let component: FmuMaxStepSizeComponent;
  let fixture: ComponentFixture<FmuMaxStepSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FmuMaxStepSizeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FmuMaxStepSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
