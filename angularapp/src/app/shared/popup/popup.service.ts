import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Shape of one popup on screen
export interface PopupState {
  visible: boolean;
  type: 'success' | 'error' | 'confirm';
  title: string;
  message: string;
  onConfirm?: () => void;   // runs when Yes is clicked (confirm only)
}

@Injectable({ providedIn: 'root' })
export class PopupService {

  // The current popup state; component listens to this
  private state = new BehaviorSubject<PopupState>({
    visible: false,
    type: 'success',
    title: '',
    message: ''
  });

  // Component subscribes to this to know when to show/hide
  state$ = this.state.asObservable();

  // Show green success popup (auto-closes in 2s)
  success(message: string, title: string = 'Success'): void {
    this.state.next({ visible: true, type: 'success', title, message });
    setTimeout(() => this.close(), 2000);
  }

  // Show red error popup (auto-closes in 2.5s)
  error(message: string, title: string = 'Oops!'): void {
    this.state.next({ visible: true, type: 'error', title, message });
    setTimeout(() => this.close(), 2500);
  }

  // Show yellow Yes/No confirmation popup (stays until user clicks)
  confirm(message: string, onConfirm: () => void, title: string = 'Are you sure?'): void {
    this.state.next({ visible: true, type: 'confirm', title, message, onConfirm });
  }

  // Called when user clicks Yes on a confirm popup
  runConfirm(): void {
    const current = this.state.value;
    if (current.onConfirm) current.onConfirm();
    this.close();
  }

  // Close popup manually
  close(): void {
    this.state.next({ visible: false, type: 'success', title: '', message: '' });
  }
}