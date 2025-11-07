import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormgroupPage } from './formgroup.page';

describe('FormgroupPage', () => {
  let component: FormgroupPage;
  let fixture: ComponentFixture<FormgroupPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormgroupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
