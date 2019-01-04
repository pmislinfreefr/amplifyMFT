import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidnavbarComponent } from './sidnavbar.component';

describe('SidnavbarComponent', () => {
  let component: SidnavbarComponent;
  let fixture: ComponentFixture<SidnavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SidnavbarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidnavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
