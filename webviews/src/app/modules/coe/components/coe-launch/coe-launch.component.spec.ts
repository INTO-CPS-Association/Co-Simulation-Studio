import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoeLaunchComponent } from './coe-launch.component';

describe('CoeLaunchComponent', () => {
  let component: CoeLaunchComponent;
  let fixture: ComponentFixture<CoeLaunchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoeLaunchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoeLaunchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
