import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  message = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  doLogin(): void {
    if (this.loginForm.invalid) {
      this.message = 'Please enter username and password.';
      return;
    }

    const { username, password } = this.loginForm.value;
    const res = this.auth.login(username, password);
    this.message = res.message;

    if (res.success) {
      this.router.navigate(['/home']);
    }
  }
}
