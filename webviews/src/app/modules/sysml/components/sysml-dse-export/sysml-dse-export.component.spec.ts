import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysmlDseExportComponent } from './sysml-dse-export.component'; //FIXME non-angular interface

describe('SysmlDseExportComponent', () => {
  let component: SysmlDseExportComponent;
  let fixture: ComponentFixture<SysmlDseExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SysmlDseExportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SysmlDseExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
