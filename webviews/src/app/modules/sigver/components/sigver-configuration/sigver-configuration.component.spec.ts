import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigverConfigurationComponent } from './sigver-configuration.component';

describe('SigverConfigurationComponent', () => {
  let component: SigverConfigurationComponent;
  let fixture: ComponentFixture<SigverConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SigverConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SigverConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
