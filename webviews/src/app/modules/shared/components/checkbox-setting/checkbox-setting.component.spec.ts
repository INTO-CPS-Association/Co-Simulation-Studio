import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxSettingComponent } from './checkbox-setting.component';

describe('CheckboxSettingComponent', () => {
  let component: CheckboxSettingComponent;
  let fixture: ComponentFixture<CheckboxSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckboxSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckboxSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
