import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactExampleComponent } from './react-example.component';

describe('ReactExampleComponent', () => {
  let component: ReactExampleComponent;
  let fixture: ComponentFixture<ReactExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReactExampleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReactExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
