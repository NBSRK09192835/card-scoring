import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../auth.service';
import { StorageService } from '../../shared/storage.service';
import { GuestUsernameDialogComponent } from '../guest-username/guest-username-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private storage: StorageService
  ) {}

  enterAsGuest(): void {
    const dialogRef = this.dialog.open(GuestUsernameDialogComponent, {
      width: '420px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((username: string | undefined) => {
      if (!username || !username.trim()) {
        return;
      }

      const state = this.auth.startGuest(username.trim());
      this.router.navigate([`/${encodeURIComponent(state.username)}`]);
    });
  }

  clearStoredData(): void {
    this.storage.clearAppData();
    this.auth.logout();
  }
}
