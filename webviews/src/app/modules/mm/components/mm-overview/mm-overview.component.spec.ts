import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MmOverviewComponent } from './mm-overview.component';

describe('MmOverviewComponent', () => {
  let component: MmOverviewComponent;
  let fixture: ComponentFixture<MmOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MmOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MmOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
