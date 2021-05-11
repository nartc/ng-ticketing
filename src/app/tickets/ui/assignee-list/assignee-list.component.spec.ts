import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigneeListComponent } from './assignee-list.component';

describe('AssigneeListComponent', () => {
  let component: AssigneeListComponent;
  let fixture: ComponentFixture<AssigneeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssigneeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssigneeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
