import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-guest-username-dialog',
  templateUrl: './guest-username-dialog.component.html',
  styleUrls: ['./guest-username-dialog.component.scss']
})
export class GuestUsernameDialogComponent {
  usernameForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<GuestUsernameDialogComponent>
  ) {
    this.usernameForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9@#$ ]+$/)]]
    });
  }

  onSubmit(): void {
    if (this.usernameForm.invalid) {
      this.usernameForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.usernameForm.get('username')?.value.trim());
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
