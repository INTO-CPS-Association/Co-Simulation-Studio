import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DseCoeLaunchComponent } from './dse-coe-launch.component';

describe('DseCoeLaunchComponent', () => {
  let component: DseCoeLaunchComponent;
  let fixture: ComponentFixture<DseCoeLaunchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DseCoeLaunchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DseCoeLaunchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
