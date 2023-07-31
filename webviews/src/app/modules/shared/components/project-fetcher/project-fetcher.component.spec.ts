import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFetcherComponent } from './project-fetcher.component';

describe('ProjectFetcherComponent', () => {
  let component: ProjectFetcherComponent;
  let fixture: ComponentFixture<ProjectFetcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectFetcherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectFetcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
