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

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.guestForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9@#$]+$/)]]
    });
  }

  startGuest(): void {
    const username = this.guestForm.get('username')?.value;
    const state = this.auth.startGuest(username);
    this.message = `Guest session started as ${state.username}`;
    setTimeout(() => this.router.navigate([`/${encodeURIComponent(state.username)}`]), 5000);
  }
}
