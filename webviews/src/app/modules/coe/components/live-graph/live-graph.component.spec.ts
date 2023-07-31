import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveGraphComponent } from './live-graph.component';

describe('LiveGraphComponent', () => {
  let component: LiveGraphComponent;
  let fixture: ComponentFixture<LiveGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
