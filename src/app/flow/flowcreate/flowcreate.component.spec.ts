import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowcreateComponent } from './flowcreate.component';

describe('FlowcreateComponent', () => {
  let component: FlowcreateComponent;
  let fixture: ComponentFixture<FlowcreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FlowcreateComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowcreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
