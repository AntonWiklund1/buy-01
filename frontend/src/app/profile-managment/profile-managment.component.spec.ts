import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileManagmentComponent } from './profile-managment.component';

describe('ProfileManagmentComponent', () => {
  let component: ProfileManagmentComponent;
  let fixture: ComponentFixture<ProfileManagmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileManagmentComponent]
    });
    fixture = TestBed.createComponent(ProfileManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
