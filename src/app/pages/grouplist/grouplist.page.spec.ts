import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GrouplistPage } from './grouplist.page';

describe('GrouplistPage', () => {
  let component: GrouplistPage;
  let fixture: ComponentFixture<GrouplistPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GrouplistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
