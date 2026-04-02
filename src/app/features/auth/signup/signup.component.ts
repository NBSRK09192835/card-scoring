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
  bannerMessage = '';
  bannerType: 'success' | 'error' | '' = '';

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
    this.bannerMessage = '';
    this.bannerType = '';

    if (this.signupForm.invalid) {
      this.setError('Please fill all required fields correctly.');
      return;
    }

    const data = this.signupForm.value;

    if (data.password !== data.confirmPassword) {
      this.setError('Passwords do not match.');
      return;
    }

    console.log('Signup data:', {
      username: data.username,
      name: data.name,
      email: data.email
    });

    const result = this.auth.signup({
      username: data.username,
      password: data.password,
      name: data.name,
      email: data.email
    });

    if (result.success) {
      this.bannerType = 'success';
      this.bannerMessage = `${data.username} signed up successfully.`;
      setTimeout(() => this.router.navigate(['/home']), 5000);
      return;
    }

    if (result.code === 'SERVER') {
      this.setError('Server Unresponsive');
    } else if (result.code === 'UNKNOWN') {
      this.setError('Please try later');
    } else {
      this.setError(result.message || 'Please try later');
    }
  }

  private setError(text: string): void {
    this.bannerType = 'error';
    this.bannerMessage = text;
  }
}

