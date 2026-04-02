import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
      username: ['']
    });
  }

  startGuest(): void {
    const username = this.guestForm.get('username')?.value;
    this.auth.startGuest(username);
    this.message = `Guest session started${username ? ' as ' + username : ''}`;
    setTimeout(() => this.router.navigate(['/home']), 600);
  }
}
