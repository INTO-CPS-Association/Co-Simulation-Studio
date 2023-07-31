import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MmPageComponent } from './mm-page.component';

describe('MmPageComponent', () => {
  let component: MmPageComponent;
  let fixture: ComponentFixture<MmPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MmPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
