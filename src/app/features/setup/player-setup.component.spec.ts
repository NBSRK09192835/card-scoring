import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionFacade } from '../../core/facades/session-facade.service';
import { ToastService } from '../../core/services/toast/toast.service';
import { PlayerSetupComponent } from './player-setup.component';

describe('PlayerSetupComponent', () => {
  let component: PlayerSetupComponent;
  let fixture: ComponentFixture<PlayerSetupComponent>;
  let mockRoute: { snapshot: { paramMap: { get: jest.MockedFunction<any> } } };
  let mockRouter: { navigate: jest.Mock };
  let mockSession: {
    getUsername: jest.Mock;
    setUsername: jest.Mock;
    getPlayers: jest.Mock;
    setPlayers: jest.Mock;
    getLossPerHead: jest.Mock;
    setGameSetup: jest.Mock;
    clearSession: jest.Mock;
  };
  let mockToast: { show: jest.Mock };

  beforeEach(async () => {
    mockRoute = {
      snapshot: {
        paramMap: { get: jest.fn() }
      }
    };
    mockRouter = { navigate: jest.fn() };
    mockSession = {
      getUsername: jest.fn(),
      setUsername: jest.fn(),
      getPlayers: jest.fn(),
      setPlayers: jest.fn(),
      getLossPerHead: jest.fn(),
      setGameSetup: jest.fn(),
      clearSession: jest.fn()
    };
    mockToast = { show: jest.fn() };

    // Mock window.prompt
    Object.defineProperty(window, 'prompt', {
      value: jest.fn(),
      writable: true
    });

    await TestBed.configureTestingModule({
      declarations: [PlayerSetupComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
        { provide: SessionFacade, useValue: mockSession },
        { provide: ToastService, useValue: mockToast }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerSetupComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set username from route', () => {
      mockRoute.snapshot.paramMap.get.mockReturnValue('testuser');
      mockSession.getPlayers.mockReturnValue([]);

      component.ngOnInit();

      expect(component.username).toBe('testuser');
      expect(mockSession.setUsername).toHaveBeenCalledWith('testuser');
    });

    it('should set username from session if no route', () => {
      mockRoute.snapshot.paramMap.get.mockReturnValue(null);
      mockSession.getUsername.mockReturnValue('storeduser');
      mockSession.getPlayers.mockReturnValue([]);

      component.ngOnInit();

      expect(component.username).toBe('storeduser');
    });

    it('should use default players if none stored', () => {
      mockRoute.snapshot.paramMap.get.mockReturnValue('testuser');
      mockSession.getPlayers.mockReturnValue([]);

      component.ngOnInit();

      expect(component.players).toEqual(component.players); // default players
    });
  });

  describe('togglePlayer', () => {
    it('should add player to selected if not selected', () => {
      component.selectedPlayers = ['Alice'];
      component.togglePlayer('Bob');
      expect(component.selectedPlayers).toEqual(['Alice', 'Bob']);
    });

    it('should remove player from selected if already selected', () => {
      component.selectedPlayers = ['Alice', 'Bob'];
      component.togglePlayer('Alice');
      expect(component.selectedPlayers).toEqual(['Bob']);
    });
  });

  describe('isSelected', () => {
    it('should return true if player is selected', () => {
      component.selectedPlayers = ['Alice'];
      expect(component.isSelected('Alice')).toBe(true);
    });

    it('should return false if player is not selected', () => {
      component.selectedPlayers = ['Alice'];
      expect(component.isSelected('Bob')).toBe(false);
    });
  });

  describe('addPlayer', () => {
    it('should add new player', () => {
      component.players = ['Alice'];
      component.newPlayer = 'Bob';
      component.selectedPlayers = [];

      component.addPlayer();

      expect(component.players).toEqual(['Alice', 'Bob']);
      expect(component.selectedPlayers).toEqual(['Bob']);
      expect(component.newPlayer).toBe('');
      expect(mockSession.setPlayers).toHaveBeenCalledWith(['Alice', 'Bob']);
      expect(mockToast.show).toHaveBeenCalledWith('Player added successfully', 'success');
    });

    it('should show error for empty name', () => {
      component.newPlayer = '';
      component.addPlayer();
      expect(mockToast.show).toHaveBeenCalledWith('Enter a valid player name', 'error');
    });

    it('should show error for duplicate name', () => {
      component.players = ['Alice'];
      component.newPlayer = 'Alice';
      component.addPlayer();
      expect(mockToast.show).toHaveBeenCalledWith('Player already exists', 'error');
    });
  });

  describe('editUsername', () => {
    it('should update username', () => {
      (window.prompt as jest.Mock).mockReturnValue('newuser');
      component.username = 'olduser';

      component.editUsername();

      expect(component.username).toBe('newuser');
      expect(mockSession.setUsername).toHaveBeenCalledWith('newuser');
      expect(mockToast.show).toHaveBeenCalledWith('Username updated', 'success');
    });

    it('should not update if prompt returns empty', () => {
      (window.prompt as jest.Mock).mockReturnValue('');
      component.username = 'olduser';

      component.editUsername();

      expect(component.username).toBe('olduser');
    });
  });

  describe('goBack', () => {
    it('should clear session and navigate to home', () => {
      component.goBack();
      expect(mockSession.clearSession).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    });
  });

  describe('continue', () => {
    it('should navigate to score if valid', () => {
      component.selectedPlayers = ['Alice', 'Bob'];
      component.losePerHead = 20;
      component.username = 'testuser';

      component.continue();

      expect(mockSession.setGameSetup).toHaveBeenCalledWith({
        players: ['Alice', 'Bob'],
        losePerHead: 20,
        username: 'testuser'
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/testuser/score']);
    });

    it('should show error if less than 2 players', () => {
      component.selectedPlayers = ['Alice'];

      component.continue();

      expect(mockToast.show).toHaveBeenCalledWith('Select at least 2 players', 'error');
    });
  });

  describe('removePlayer', () => {
    it('should remove player from selected', () => {
      component.selectedPlayers = ['Alice', 'Bob'];
      component.removePlayer('Alice');
      expect(component.selectedPlayers).toEqual(['Bob']);
    });
  });
});