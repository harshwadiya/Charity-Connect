import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MydonationComponent } from './mydonation.component';

describe('MydonationComponent', () => {
  let component: MydonationComponent;
  let fixture: ComponentFixture<MydonationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MydonationComponent ],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MydonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_mydonation_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_donation_details_heading_in_the_mydonation_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Donation Details');
  });
});
