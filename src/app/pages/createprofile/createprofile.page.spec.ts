import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateprofilePage } from './createprofile.page';

describe('CreateprofilePage', () => {
  let component: CreateprofilePage;
  let fixture: ComponentFixture<CreateprofilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateprofilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
