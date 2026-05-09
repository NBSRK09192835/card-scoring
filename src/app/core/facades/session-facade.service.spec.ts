import { TestBed } from '@angular/core/testing';
import { SessionFacade } from './session-facade.service';
import { SessionService } from '../services/session/session.service';
import { SessionState } from '../models/session-state';

describe('SessionFacade', () => {
  let service: SessionFacade;
  let sessionService: any;

  beforeEach(() => {
    const sessionServiceMock = {
      getUsername: jest.fn(),
      setUsername: jest.fn(),
      getPlayers: jest.fn(),
      setPlayers: jest.fn(),
      getLossPerHead: jest.fn(),
      setLossPerHead: jest.fn(),
      getSession: jest.fn(),
      setSession: jest.fn(),
      clearSession: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        SessionFacade,
        { provide: SessionService, useValue: sessionServiceMock }
      ]
    });

    service = TestBed.inject(SessionFacade);
    sessionService = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Username Management', () => {
    it('should get username from session service', () => {
      sessionService.getUsername.mockReturnValue('TestUser');
      const result = service.getUsername();
      expect(result).toBe('TestUser');
      expect(sessionService.getUsername).toHaveBeenCalled();
    });

    it('should set username in session service', () => {
      service.setUsername('NewUser');
      expect(sessionService.setUsername).toHaveBeenCalledWith('NewUser');
    });
  });

  describe('Players Management', () => {
    it('should get players from session service', () => {
      const players = ['Player1', 'Player2', 'Player3'];
      sessionService.getPlayers.mockReturnValue(players);
      const result = service.getPlayers();
      expect(result).toEqual(players);
      expect(sessionService.getPlayers).toHaveBeenCalled();
    });

    it('should set players in session service', () => {
      const players = ['Player1', 'Player2'];
      service.setPlayers(players);
      expect(sessionService.setPlayers).toHaveBeenCalledWith(players);
    });
  });

  describe('Loss Per Head Management', () => {
    it('should get loss per head from session service', () => {
      sessionService.getLossPerHead.mockReturnValue(50);
      const result = service.getLossPerHead();
      expect(result).toBe(50);
      expect(sessionService.getLossPerHead).toHaveBeenCalled();
    });

    it('should set loss per head in session service', () => {
      service.setLossPerHead(100);
      expect(sessionService.setLossPerHead).toHaveBeenCalledWith(100);
    });
  });

  describe('Session Management', () => {
    it('should get full session state', () => {
      const sessionState: SessionState = {
        username: 'TestUser',
        selectedPlayers: ['Player1', 'Player2'],
        lossPerHead: 50
      };
      sessionService.getSession.mockReturnValue(sessionState);
      const result = service.getSession();
      expect(result).toEqual(sessionState);
      expect(sessionService.getSession).toHaveBeenCalled();
    });

    it('should set full session state', () => {
      const sessionState: SessionState = {
        username: 'TestUser',
        selectedPlayers: ['Player1'],
        lossPerHead: 100
      };
      service.setSession(sessionState);
      expect(sessionService.setSession).toHaveBeenCalledWith(sessionState);
    });

    it('should clear session', () => {
      service.clearSession();
      expect(sessionService.clearSession).toHaveBeenCalled();
    });
  });

  describe('Game Setup', () => {
    it('should set complete game setup', () => {
      const gameSetup = {
        username: 'TestUser',
        players: ['Player1', 'Player2', 'Player3'],
        losePerHead: 50
      };

      service.setGameSetup(gameSetup);

      expect(sessionService.setUsername).toHaveBeenCalledWith('TestUser');
      expect(sessionService.setPlayers).toHaveBeenCalledWith(['Player1', 'Player2', 'Player3']);
      expect(sessionService.setLossPerHead).toHaveBeenCalledWith(50);
    });

    it('should handle game setup with zero loss per head', () => {
      const gameSetup = {
        username: 'User',
        players: ['P1'],
        losePerHead: 0
      };

      service.setGameSetup(gameSetup);

      expect(sessionService.setLossPerHead).toHaveBeenCalledWith(0);
    });
  });
});
