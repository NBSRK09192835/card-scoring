import { Injectable } from '@angular/core';
import { SESSION_KEYS } from '../../constants/session-keys.const';
import { SessionState } from '../../models/session-state';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private readonly USERNAME_KEY = SESSION_KEYS.USERNAME;
  private readonly PLAYERS_KEY = SESSION_KEYS.PLAYERS;
  private readonly LOSS_KEY = SESSION_KEYS.LOSS;

  // ===== USERNAME =====
  getUsername(): string {
    return localStorage.getItem(this.USERNAME_KEY) || '';
  }

  setUsername(username: string): void {
    localStorage.setItem(this.USERNAME_KEY, username);
  }

  // ===== PLAYERS =====
  getPlayers(): string[] {
    const data = localStorage.getItem(this.PLAYERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  setPlayers(players: string[]): void {
    localStorage.setItem(this.PLAYERS_KEY, JSON.stringify(players));
  }

  // ===== LOSS =====
  getLossPerHead(): number {
    const value = localStorage.getItem(this.LOSS_KEY);
    return value ? Number(value) : 10;
  }

  setLossPerHead(value: number): void {
    localStorage.setItem(this.LOSS_KEY, String(value));
  }

  // ===== FULL SESSION =====
  getSession(): SessionState {
    return {
      username: this.getUsername() || 'Guest',
      selectedPlayers: this.getPlayers(),
      lossPerHead: this.getLossPerHead()
    };
  }

  setSession(state: SessionState): void {
    this.setUsername(state.username);
    this.setPlayers(state.selectedPlayers);
    this.setLossPerHead(state.lossPerHead);
  }

  // ===== CLEAR =====
  clearSession(): void {
    localStorage.removeItem(this.USERNAME_KEY);
    localStorage.removeItem(this.PLAYERS_KEY);
    localStorage.removeItem(this.LOSS_KEY);
  }
}