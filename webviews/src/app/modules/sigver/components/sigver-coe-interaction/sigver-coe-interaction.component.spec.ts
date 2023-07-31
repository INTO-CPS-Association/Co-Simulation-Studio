import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigverCoeInteractionComponent } from './sigver-coe-interaction.component';

describe('SigverCoeInteractionComponent', () => {
  let component: SigverCoeInteractionComponent;
  let fixture: ComponentFixture<SigverCoeInteractionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SigverCoeInteractionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SigverCoeInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
