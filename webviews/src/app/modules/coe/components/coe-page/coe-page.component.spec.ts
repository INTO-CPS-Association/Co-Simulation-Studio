import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoePageComponent } from './coe-page.component';

describe('CoePageComponent', () => {
  let component: CoePageComponent;
  let fixture: ComponentFixture<CoePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
