import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AdminviewcharityComponent } from './adminviewcharity.component';

describe('AdminviewcharityComponent', () => {
  let component: AdminviewcharityComponent;
  let fixture: ComponentFixture<AdminviewcharityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminviewcharityComponent ],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminviewcharityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_adminviewcharity_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_charities_heading_in_the_adminviewcharity_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Charities');
  });
});
