import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoeConfigurationComponent } from './coe-configuration.component';

describe('CoeConfigurationComponent', () => {
  let component: CoeConfigurationComponent;
  let fixture: ComponentFixture<CoeConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoeConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoeConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
