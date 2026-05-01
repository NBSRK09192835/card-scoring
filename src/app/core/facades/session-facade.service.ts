import { Injectable } from '@angular/core';
import { SessionService } from '../services/session/session.service';
import { SessionState } from '../models/session-state';

@Injectable({
  providedIn: 'root'
})
export class SessionFacade {

  constructor(private session: SessionService) { }

  // ===== USERNAME =====
  getUsername(): string {
    return this.session.getUsername();
  }

  setUsername(username: string): void {
    this.session.setUsername(username);
  }

  // ===== PLAYERS =====
  getPlayers(): string[] {
    return this.session.getPlayers();
  }

  setPlayers(players: string[]): void {
    this.session.setPlayers(players);
  }

  // ===== LOSS =====
  getLossPerHead(): number {
    return this.session.getLossPerHead();
  }

  setLossPerHead(value: number): void {
    this.session.setLossPerHead(value);
  }

  // ===== FULL SESSION =====
  getSession(): SessionState {
    return this.session.getSession();
  }

  setSession(state: SessionState): void {
    this.session.setSession(state);
  }

  // ===== CLEAR =====
  clearSession(): void {
    this.session.clearSession();
  }

  setGameSetup(data: {
    username: string;
    players: string[];
    losePerHead: number;
  }) {
    this.setUsername(data.username);
    this.setPlayers(data.players);
    this.setLossPerHead(data.losePerHead);
  }

}