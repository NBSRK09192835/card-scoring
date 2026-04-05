import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { StorageService } from '../../shared/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
    private storage: StorageService
  ) {}

  enterAsGuest(): void {
    const state = this.auth.startGuest();
    this.router.navigate([`/${encodeURIComponent(state.username)}`]);
  }

  clearStoredData(): void {
    this.storage.clearAppData();
    this.auth.logout();
  }
}
