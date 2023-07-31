import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysmlExportComponent } from './sysml-export.component';

describe('SysmlExportComponent', () => {
  let component: SysmlExportComponent;
  let fixture: ComponentFixture<SysmlExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SysmlExportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SysmlExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
