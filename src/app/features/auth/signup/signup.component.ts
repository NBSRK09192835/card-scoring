import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  message = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  doSignup(): void {
    if (this.signupForm.invalid) {
      this.message = 'Please fill all required fields correctly.';
      return;
    }

    const data = this.signupForm.value;
    if (data.password !== data.confirmPassword) {
      this.message = 'Passwords do not match.';
      return;
    }

    const result = this.auth.signup({
      username: data.username,
      password: data.password,
      name: data.name,
      email: data.email
    });

    this.message = result.message;
    if (result.success) {
      this.router.navigate(['/home']);
    }
  }
}
