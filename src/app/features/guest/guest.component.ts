import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionFacade } from '../../core/facades/session-facade.service';
import { ToastService } from '../../core/services/toast/toast.service';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.scss']
})
export class GuestComponent implements OnInit {

  guestForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private session: SessionFacade,
    private toast: ToastService
  ) {
    this.guestForm = this.fb.group({
      username: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const existing = this.session.getUsername();

    if (existing && existing !== 'Guest') {
      this.guestForm.patchValue({ username: existing });
    }
  }

  startGuest(username?: string): void {
    const enteredName = (username || this.guestForm.get('username')?.value || '').trim();

    if (!enteredName) {
      this.guestForm.markAllAsTouched();
      this.toast.show('Please enter a valid guest name.', 'error');
      return;
    }

    const existing = this.session.getUsername();

    if (existing && existing.toLowerCase() === enteredName.toLowerCase()) {
      this.toast.show(`"${enteredName}" is already active.`, 'error');
      return;
    }

    if (existing) {
      const replace = window.confirm(`Session already exists as "${existing}". Replace it?`);
      if (!replace) return;

      this.session.clearSession();
      this.completeGuest(enteredName);
      return;
    }

    this.completeGuest(enteredName);
  }

  private completeGuest(username: string): void {
    this.session.setUsername(username);
    this.toast.show(`Guest session started as ${username}`, 'success');
    this.router.navigate([`/${encodeURIComponent(username)}`]);
  }
}