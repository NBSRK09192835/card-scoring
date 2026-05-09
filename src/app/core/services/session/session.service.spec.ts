import { TestBed } from '@angular/core/testing';

import { SessionService } from './session.service';
import { SessionState } from '../../models/session-state';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);

    // Mock localStorage
    const mockLocalStorage = new Map<string, string>();
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => mockLocalStorage.get(key) || null,
        setItem: (key: string, value: string) => mockLocalStorage.set(key, value),
        removeItem: (key: string) => mockLocalStorage.delete(key)
      },
      writable: true
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Username Management', () => {
    it('should set and get username', () => {
      const username = 'testuser';
      service.setUsername(username);
      const result = service.getUsername();
      expect(result).toBe(username);
    });

    it('should return empty string when no username', () => {
      const result = service.getUsername();
      expect(result).toBe('');
    });
  });

  describe('Players Management', () => {
    it('should set and get players', () => {
      const players = ['Alice', 'Bob', 'Charlie'];
      service.setPlayers(players);
      const result = service.getPlayers();
      expect(result).toEqual(players);
    });

    it('should return empty array when no players', () => {
      const result = service.getPlayers();
      expect(result).toEqual([]);
    });
  });

  describe('Loss Per Head Management', () => {
    it('should set and get loss per head', () => {
      const loss = 15;
      service.setLossPerHead(loss);
      const result = service.getLossPerHead();
      expect(result).toBe(loss);
    });

    it('should return default 10 when no loss set', () => {
      const result = service.getLossPerHead();
      expect(result).toBe(10);
    });
  });

  describe('Session Management', () => {
    it('should get session with defaults', () => {
      const result = service.getSession();
      expect(result).toEqual({
        username: 'Guest',
        selectedPlayers: [],
        lossPerHead: 10
      });
    });

    it('should set and get session', () => {
      const state: SessionState = {
        username: 'testuser',
        selectedPlayers: ['Alice', 'Bob'],
        lossPerHead: 20
      };
      service.setSession(state);
      const result = service.getSession();
      expect(result).toEqual(state);
    });

    it('should clear session', () => {
      const state: SessionState = {
        username: 'testuser',
        selectedPlayers: ['Alice', 'Bob'],
        lossPerHead: 20
      };
      service.setSession(state);
      service.clearSession();
      const result = service.getSession();
      expect(result).toEqual({
        username: 'Guest',
        selectedPlayers: [],
        lossPerHead: 10
      });
    });
  });
});
