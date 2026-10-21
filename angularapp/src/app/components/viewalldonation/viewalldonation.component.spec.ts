import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ViewalldonationComponent } from './viewalldonation.component';

describe('ViewalldonationComponent', () => {
  let component: ViewalldonationComponent;
  let fixture: ComponentFixture<ViewalldonationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewalldonationComponent ],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewalldonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_viewalldonation_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_all_donations_heading_in_the_viewalldonation_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('All Donations');
  });
});
