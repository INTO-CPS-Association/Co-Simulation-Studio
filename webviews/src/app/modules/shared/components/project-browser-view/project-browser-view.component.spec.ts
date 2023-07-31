import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBrowserViewComponent } from './project-browser-view.component';

describe('ProjectBrowserViewComponent', () => {
  let component: ProjectBrowserViewComponent;
  let fixture: ComponentFixture<ProjectBrowserViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectBrowserViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectBrowserViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
