import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileManagementComponent } from './profile-managment.component';

describe('ProfileManagementComponent', () => {
  let component: ProfileManagementComponent;
  let fixture: ComponentFixture<ProfileManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileManagementComponent]
    });
    fixture = TestBed.createComponent(ProfileManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
