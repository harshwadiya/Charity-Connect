import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UserviewcharityComponent } from './userviewcharity.component';

describe('UserviewcharityComponent', () => {
  let component: UserviewcharityComponent;
  let fixture: ComponentFixture<UserviewcharityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserviewcharityComponent ],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserviewcharityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_userviewcharity_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_charities_heading_in_the_userviewcharity_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Charities');
  });
});
