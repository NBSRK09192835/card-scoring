import { Injectable } from '@angular/core';
import { StorageService, User, GuestState } from './shared/storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private storage: StorageService) {}

  signup(user: User): { success: boolean; message: string; code?: 'DUPLICATE' | 'SERVER' | 'UNKNOWN' } {
    const users = this.storage.getUsers();
    if (users.some(u => u.username.toLowerCase() === user.username.toLowerCase())) {
      return { success: false, message: 'Username already exists', code: 'DUPLICATE' };
    }

    try {
      users.push(user);
      this.storage.saveUsers(users);
      this.storage.setCurrentUser(user);
      return { success: true, message: 'Signup successful' };
    } catch (error) {
      if (error instanceof DOMException || error instanceof Error) {
        // treat localStorage write issues as server/db unresponsive analogs
        return { success: false, message: 'Server Unresponsive', code: 'SERVER' };
      }
      return { success: false, message: 'Please try later', code: 'UNKNOWN' };
    }
  }

  login(username: string, password: string): { success: boolean; message: string; user?: User } {
    const users = this.storage.getUsers();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    if (user.password !== password) {
      return { success: false, message: 'Invalid password' };
    }
    this.storage.setCurrentUser(user);
    return { success: true, message: 'Login successful', user };
  }

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
    return state;
  }

  saveGuestToLocal(): void {
    const state = this.storage.getGuestSession();
    if (state) {
      this.storage.setGuestLocal(state);
    }
  }
}
