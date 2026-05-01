import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionFacade } from '../../core/facades/session-facade.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {

  constructor(
    private router: Router,
    private session: SessionFacade
  ) { }

  enterAsGuest(): void {
    this.router.navigate(['/guest']);
  }

  clearStoredData(): void {
    this.session.clearSession();
  }

  hasActiveSession(): boolean {
    return !!this.session.getUsername();
  }

  resumeSession(): void {
    const username = this.session.getUsername();
    if (username) {
      this.router.navigate([`/${encodeURIComponent(username)}`]);
    }
  }
}
