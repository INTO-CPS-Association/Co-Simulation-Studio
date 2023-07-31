import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigverPageComponent } from './sigver-page.component';

describe('SigverPageComponent', () => {
  let component: SigverPageComponent;
  let fixture: ComponentFixture<SigverPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SigverPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SigverPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
