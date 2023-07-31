import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoeServerStatusComponent } from './coe-server-status.component';

describe('CoeServerStatusComponent', () => {
  let component: CoeServerStatusComponent;
  let fixture: ComponentFixture<CoeServerStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoeServerStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoeServerStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
