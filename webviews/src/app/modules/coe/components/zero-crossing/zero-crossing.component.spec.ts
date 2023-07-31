import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZeroCrossingComponent } from './zero-crossing.component';

describe('ZeroCrossingComponent', () => {
  let component: ZeroCrossingComponent;
  let fixture: ComponentFixture<ZeroCrossingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZeroCrossingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZeroCrossingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
