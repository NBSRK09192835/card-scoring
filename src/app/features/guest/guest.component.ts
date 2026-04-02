import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.scss']
})
export class GuestComponent {
  guestForm: FormGroup;
  message = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.guestForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9@#$]+$/)]]
    });

    // Keep guest username when returning to guest entry
    const active = this.auth.getActiveUsername();
    if (active) {
      this.guestForm.get('username')?.setValue(active);
    }
  }

  startGuest(): void {
    if (this.guestForm.invalid) {
      this.guestForm.markAllAsTouched();
      this.messageType = 'error';
      this.message = 'Validation failed: please enter a valid guest name.';
      return;
    }

    const username = this.guestForm.get('username')?.value;
    const state = this.auth.startGuest(username);
    this.messageType = 'success';
    this.message = `Guest session started as ${state.username}`;
    setTimeout(() => this.router.navigate([`/${encodeURIComponent(state.username)}`]), 5000);
  }
}
