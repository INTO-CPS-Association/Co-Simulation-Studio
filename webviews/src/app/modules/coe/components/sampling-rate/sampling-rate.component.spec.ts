import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplingRateComponent } from './sampling-rate.component';

describe('SamplingRateComponent', () => {
  let component: SamplingRateComponent;
  let fixture: ComponentFixture<SamplingRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SamplingRateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SamplingRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
