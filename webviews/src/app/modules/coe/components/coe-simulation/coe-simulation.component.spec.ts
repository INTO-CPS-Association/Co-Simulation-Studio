import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoeSimulationComponent } from './coe-simulation.component';

describe('CoeSimulationComponent', () => {
  let component: CoeSimulationComponent;
  let fixture: ComponentFixture<CoeSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoeSimulationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoeSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
