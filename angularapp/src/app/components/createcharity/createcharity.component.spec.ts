import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CreatecharityComponent } from './createcharity.component';

describe('CreatecharityComponent', () => {
  let component: CreatecharityComponent;
  let fixture: ComponentFixture<CreatecharityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatecharityComponent ],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatecharityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_createcharity_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_charity_creation_form_heading_in_the_createcharity_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Charity Creation Form');
  });
});
