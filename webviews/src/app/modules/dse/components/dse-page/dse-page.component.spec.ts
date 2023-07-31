import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsePageComponent } from './dse-page.component';

describe('DsePageComponent', () => {
  let component: DsePageComponent;
  let fixture: ComponentFixture<DsePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DsePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DsePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
