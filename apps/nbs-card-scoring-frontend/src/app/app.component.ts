import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { StorageService, GuestState, User } from './shared/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  mode: 'login' | 'signup' | 'guest' | 'home' = 'login';
  loginForm: FormGroup;
  signupForm: FormGroup;
  guestForm: FormGroup;
  message = '';
  currentUser: User | null = null;
  guestState: GuestState | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private storage: StorageService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });

    this.guestForm = this.fb.group({
      username: ['']
    });
  }

  ngOnInit(): void {
    const localGuest = this.storage.getGuestLocal();
    if (localGuest) {
      this.guestState = localGuest;
      this.mode = 'guest';
      this.message = 'Restored guest data from local storage.';
      return;
    }

    const sessionGuest = this.storage.getGuestSession();
    if (sessionGuest) {
      this.guestState = sessionGuest;
      this.mode = 'guest';
      this.message = 'Restored guest session data.';
      return;
    }

    const current = this.storage.getCurrentUser();
    if (current) {
      this.currentUser = current;
      this.mode = 'home';
      this.message = `Welcome back ${current.name}!`;
    }
  }

  setMode(mode: 'login' | 'signup' | 'guest' | 'home') {
    this.mode = mode;
    this.message = '';
  }

  doLogin(): void {
    if (this.loginForm.invalid) {
      this.message = 'Please fill in all login fields.';
      return;
    }
    const { username, password } = this.loginForm.value;
    const res = this.auth.login(username, password);
    this.message = res.message;
    if (res.success) {
      this.currentUser = res.user!;
      this.mode = 'home';
    }
  }

  doSignup(): void {
    if (this.signupForm.invalid) {
      this.message = 'Please fill in signup details correctly.';
      return;
    }
    const data = this.signupForm.value;
    if (data.password !== data.confirmPassword) {
      this.message = 'Passwords do not match.';
      return;
    }
    const user: User = {
      username: data.username,
      password: data.password,
      name: data.name,
      email: data.email,
      phone: data.phone
    };
    const res = this.auth.signup(user);
    this.message = res.message;
    if (res.success) {
      this.currentUser = user;
      this.mode = 'home';
    }
  }

  startGuest() {
    const username = this.guestForm.value.username;
    this.guestState = this.auth.startGuest(username);
    this.mode = 'guest';
    this.message = `Guest started as ${this.guestState.username}`;
  }

  saveGuestLocal() {
    if (!this.guestState) {
      this.message = 'No guest session to save';
      return;
    }
    this.auth.saveGuestToLocal();
    this.message = 'Guest progress saved to local storage.';
  }

  logout() {
    this.auth.logout();
    this.currentUser = null;
    this.mode = 'login';
    this.message = 'Logged out.';
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event): void {
    if (this.guestState) {
      const confirmed = confirm('Save guest data to local storage before leaving?');
      if (confirmed) {
        this.auth.saveGuestToLocal();
      }
    }
  }
}
