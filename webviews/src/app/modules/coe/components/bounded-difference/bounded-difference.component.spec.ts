import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoundedDifferenceComponent } from './bounded-difference.component';

describe('BoundedDifferenceComponent', () => {
  let component: BoundedDifferenceComponent;
  let fixture: ComponentFixture<BoundedDifferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoundedDifferenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoundedDifferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
