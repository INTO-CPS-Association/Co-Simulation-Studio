import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DseConfigurationComponent } from './dse-configuration.component';

describe('DseConfigurationComponent', () => {
  let component: DseConfigurationComponent;
  let fixture: ComponentFixture<DseConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DseConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DseConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
