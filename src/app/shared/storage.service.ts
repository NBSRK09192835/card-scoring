import { Injectable } from '@angular/core';

export interface User {
  username: string;
  password: string;
  name: string;
  email: string;
  phone?: string;
}

export interface Progress {
  startedAt: string;
}

export interface GuestState {
  username: string;
  progress: Progress;
  startedAt: string;
}

const CURRENT_USER_KEY = 'nbs-card-scoring-current-user';
const GUEST_SESSION_KEY = 'nbs-card-scoring-guest-session';
const GUEST_LOCAL_KEY = 'nbs-card-scoring-guest-local';

@Injectable({ providedIn: 'root' })
export class StorageService {
  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  setGuestSession(state: GuestState): void {
    sessionStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(state));
  }

  getGuestSession(): GuestState | null {
    const raw = sessionStorage.getItem(GUEST_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  clearGuestSession(): void {
    sessionStorage.removeItem(GUEST_SESSION_KEY);
  }

  setGuestLocal(state: GuestState): void {
    localStorage.setItem(GUEST_LOCAL_KEY, JSON.stringify(state));
  }

  getGuestLocal(): GuestState | null {
    const raw = localStorage.getItem(GUEST_LOCAL_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  clearAppData(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(GUEST_LOCAL_KEY);
    localStorage.removeItem('player-setup-username');
    localStorage.removeItem('player-setup-selected-players');
    localStorage.removeItem('player-setup-loss-per-head');
    sessionStorage.removeItem(GUEST_SESSION_KEY);
  }
}
