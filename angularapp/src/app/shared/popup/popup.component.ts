import { Component, OnInit } from '@angular/core';
import { PopupService, PopupState } from './popup.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {

  state: PopupState = { visible: false, type: 'success', title: '', message: '' };

  constructor(private popupService: PopupService) {}

  ngOnInit(): void {
    // Listen to state changes from the service
    this.popupService.state$.subscribe(s => this.state = s);
  }

  onYes(): void {
    this.popupService.runConfirm();
  }

  onClose(): void {
    this.popupService.close();
  }
}