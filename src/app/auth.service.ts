import { Injectable } from '@angular/core';
import { StorageService, GuestState } from './shared/storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private storage: StorageService) {}

  logout(): void {
    this.storage.setCurrentUser(null);
    this.storage.clearGuestSession();
  }

  startGuest(username?: string): GuestState {
    const state: GuestState = {
      username: username?.trim() || `Guest_${Date.now()}`,
      progress: { startedAt: new Date().toISOString() },
      startedAt: new Date().toISOString()
    };
    this.storage.setGuestSession(state);
    // Keep a lightweight current user for welcome display
    this.storage.setCurrentUser({
      username: state.username,
      password: '',
      name: state.username,
      email: ''
    });
    return state;
  }

  getActiveUsername(): string {
    const currentUser = this.storage.getCurrentUser();
    if (currentUser && currentUser.username) {
      return currentUser.username;
    }
    const guest = this.storage.getGuestSession();
    if (guest?.username) {
      return guest.username;
    }
    const localGuest = this.storage.getGuestLocal();
    if (localGuest?.username) {
      return localGuest.username;
    }
    return 'Guest';
  }

  saveGuestToLocal(): void {
    const state = this.storage.getGuestSession();
    if (state) {
      this.storage.setGuestLocal(state);
    }
  }
}
