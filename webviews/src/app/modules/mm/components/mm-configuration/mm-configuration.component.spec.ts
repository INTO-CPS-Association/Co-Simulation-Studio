import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MmConfigurationComponent } from './mm-configuration.component';

describe('MmConfigurationComponent', () => {
  let component: MmConfigurationComponent;
  let fixture: ComponentFixture<MmConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MmConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MmConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
