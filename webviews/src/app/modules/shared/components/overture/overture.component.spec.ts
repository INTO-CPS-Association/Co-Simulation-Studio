import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertureComponent } from './overture.component';

describe('OvertureComponent', () => {
  let component: OvertureComponent;
  let fixture: ComponentFixture<OvertureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OvertureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OvertureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
