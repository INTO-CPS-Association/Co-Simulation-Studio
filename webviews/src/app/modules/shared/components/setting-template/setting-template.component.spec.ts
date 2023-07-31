import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingTemplateComponent } from './setting-template.component';

describe('SettingTemplateComponent', () => {
  let component: SettingTemplateComponent;
  let fixture: ComponentFixture<SettingTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
