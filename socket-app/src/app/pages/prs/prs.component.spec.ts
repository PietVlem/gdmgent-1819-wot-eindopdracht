import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrsComponent } from './prs.component';

describe('PrsComponent', () => {
  let component: PrsComponent;
  let fixture: ComponentFixture<PrsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
