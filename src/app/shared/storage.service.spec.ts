import { TestBed } from '@angular/core/testing';
import { StorageService, User, GuestState } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService]
    });
    service = TestBed.inject(StorageService);

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

    // Mock sessionStorage
    const mockSessionStorage = new Map<string, string>();
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: (key: string) => mockSessionStorage.get(key) || null,
        setItem: (key: string, value: string) => mockSessionStorage.set(key, value),
        removeItem: (key: string) => mockSessionStorage.delete(key)
      },
      writable: true
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Current User Management', () => {
    it('should set and get current user', () => {
      const user: User = { username: 'test', password: 'pass', name: 'Test User', email: 'test@example.com' };
      service.setCurrentUser(user);
      const result = service.getCurrentUser();
      expect(result).toEqual(user);
    });

    it('should return null when no current user', () => {
      const result = service.getCurrentUser();
      expect(result).toBeNull();
    });

    it('should remove current user when set to null', () => {
      const user: User = { username: 'test', password: 'pass', name: 'Test User', email: 'test@example.com' };
      service.setCurrentUser(user);
      service.setCurrentUser(null);
      const result = service.getCurrentUser();
      expect(result).toBeNull();
    });
  });

  describe('Guest Session Management', () => {
    it('should set and get guest session', () => {
      const state: GuestState = { username: 'guest', progress: { startedAt: '2023-01-01' }, startedAt: '2023-01-01' };
      service.setGuestSession(state);
      const result = service.getGuestSession();
      expect(result).toEqual(state);
    });

    it('should return null when no guest session', () => {
      const result = service.getGuestSession();
      expect(result).toBeNull();
    });

    it('should clear guest session', () => {
      const state: GuestState = { username: 'guest', progress: { startedAt: '2023-01-01' }, startedAt: '2023-01-01' };
      service.setGuestSession(state);
      service.clearGuestSession();
      const result = service.getGuestSession();
      expect(result).toBeNull();
    });
  });

  describe('Guest Local Management', () => {
    it('should set and get guest local', () => {
      const state: GuestState = { username: 'guest', progress: { startedAt: '2023-01-01' }, startedAt: '2023-01-01' };
      service.setGuestLocal(state);
      const result = service.getGuestLocal();
      expect(result).toEqual(state);
    });

    it('should return null when no guest local', () => {
      const result = service.getGuestLocal();
      expect(result).toBeNull();
    });
  });

  describe('Clear App Data', () => {
    it('should clear all app data', () => {
      const user: User = { username: 'test', password: 'pass', name: 'Test User', email: 'test@example.com' };
      const state: GuestState = { username: 'guest', progress: { startedAt: '2023-01-01' }, startedAt: '2023-01-01' };

      service.setCurrentUser(user);
      service.setGuestSession(state);
      service.setGuestLocal(state);

      service.clearAppData();

      expect(service.getCurrentUser()).toBeNull();
      expect(service.getGuestSession()).toBeNull();
      expect(service.getGuestLocal()).toBeNull();
    });
  });
});