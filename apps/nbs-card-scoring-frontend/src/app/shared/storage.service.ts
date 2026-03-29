import { Injectable } from '@angular/core';

export interface User {
  username: string;
  password: string;
  name: string;
  email: string;
  phone?: string;
}

export interface GuestState {
  username: string;
  progress: any;
  startedAt: string;
}

const USERS_KEY = 'nbs-card-scoring-users';
const CURRENT_USER_KEY = 'nbs-card-scoring-current-user';
const GUEST_SESSION_KEY = 'nbs-card-scoring-guest-session';
const GUEST_LOCAL_KEY = 'nbs-card-scoring-guest-local';

@Injectable({ providedIn: 'root' })
export class StorageService {
  getUsers(): User[] {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

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
}
