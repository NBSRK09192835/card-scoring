/* eslint-disable */
/// <reference types="jest" />
jest.mock('html2canvas');
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ElementRef } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { GameService, Player } from '../../core/services/game/game.service';
import { SessionFacade } from '../../core/facades/session-facade.service';
import { ToastService } from '../../core/services/toast/toast.service';
import { ScoreComponent } from './score.component';
import html2canvas from 'html2canvas';

describe('ScoreComponent', () => {
  let component: ScoreComponent;
  let fixture: ComponentFixture<ScoreComponent>;
  let mockGame: {
    setPlayers: jest.Mock;
    getPlayers: jest.Mock;
    getActivePlayers: jest.Mock;
    getRounds: jest.Mock;
    getTotals: jest.Mock;
    setPlayerActive: jest.Mock;
    addPlayer: jest.Mock;
    addRound: jest.Mock;
    updateRound: jest.Mock;
  };
  let mockSession: {
    getUsername: jest.Mock;
    getPlayers: jest.Mock;
    setPlayers: jest.Mock;
    getLossPerHead: jest.Mock;
  };
  let mockToast: { show: jest.Mock };
  let mockRouter: { navigate: jest.Mock };
  let mockDialog: { open: jest.Mock };
  let mockDialogRef: { afterClosed: jest.Mock; componentInstance: { data: any } };

  beforeEach(async () => {
    mockGame = {
      setPlayers: jest.fn(),
      getPlayers: jest.fn(),
      getActivePlayers: jest.fn(),
      getRounds: jest.fn(),
      getTotals: jest.fn(),
      setPlayerActive: jest.fn(),
      addPlayer: jest.fn(),
      addRound: jest.fn(),
      updateRound: jest.fn()
    };
    mockSession = {
      getUsername: jest.fn(),
      getPlayers: jest.fn(),
      setPlayers: jest.fn(),
      getLossPerHead: jest.fn()
    };
    mockToast = { show: jest.fn() };
    mockRouter = { navigate: jest.fn() };
    mockDialogRef = {
      afterClosed: jest.fn(),
      componentInstance: { data: {} }
    };
    mockDialog = {
      open: jest.fn().mockReturnValue(mockDialogRef)
    };

    await TestBed.configureTestingModule({
      declarations: [ScoreComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: GameService, useValue: mockGame },
        { provide: SessionFacade, useValue: mockSession },
        { provide: ToastService, useValue: mockToast },
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: mockDialog }
      ]
    })
    .overrideComponent(ScoreComponent, { set: { template: '<div #scorecard></div>' } })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreComponent);
    component = fixture.componentInstance;

    // Mock ViewChild
    component.scorecard = { nativeElement: document.createElement('div') } as ElementRef;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize with session data', () => {
      mockSession.getUsername.mockReturnValue('testuser');
      mockSession.getPlayers.mockReturnValue(['Alice', 'Bob']);
      mockSession.getLossPerHead.mockReturnValue(20);
      mockGame.getPlayers.mockReturnValue([]);
      mockGame.getRounds.mockReturnValue([]);
      mockGame.getTotals.mockReturnValue({});

      component.ngOnInit();

      expect(component.username).toBe('testuser');
      expect(mockGame.setPlayers).toHaveBeenCalledWith(['Alice', 'Bob']);
      expect(component.lossPerHead).toBe(20);
    });

    it('should use default players if none set', () => {
      mockSession.getUsername.mockReturnValue('testuser');
      mockSession.getPlayers.mockReturnValue([]);
      mockSession.getLossPerHead.mockReturnValue(10);
      mockGame.getPlayers.mockReturnValue([]);
      mockGame.getRounds.mockReturnValue([]);
      mockGame.getTotals.mockReturnValue({});

      component.ngOnInit();

      expect(mockSession.setPlayers).toHaveBeenCalledWith(component.defaultPlayers);
    });

    it('should navigate to home if less than 2 players', () => {
      mockSession.getUsername.mockReturnValue('testuser');
      mockSession.getPlayers.mockReturnValue(['Alice']);

      component.ngOnInit();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    });
  });

  describe('activePlayers', () => {
    it('should return active players from game service', () => {
      const active = ['Alice', 'Bob'];
      mockGame.getActivePlayers.mockReturnValue(active);

      expect(component.activePlayers).toEqual(active);
      expect(mockGame.getActivePlayers).toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('should update rounds and totals', () => {
      const rounds = [{ winner: 'Alice', results: {} }];
      const totals = { Alice: 10 };
      mockGame.getRounds.mockReturnValue(rounds);
      mockGame.getTotals.mockReturnValue(totals);

      component.refresh();

      expect(component.rounds).toEqual(rounds);
      expect(component.totals).toEqual(totals);
    });
  });

  describe('togglePlayer', () => {
    it('should toggle player active status', () => {
      const player: Player = { name: 'Alice', active: true };
      mockGame.setPlayerActive.mockReturnValue(true);

      component.togglePlayer(player);

      expect(mockGame.setPlayerActive).toHaveBeenCalledWith('Alice', false);
      expect(player.active).toBe(false);
    });

    it('should show error if toggle fails', () => {
      const player: Player = { name: 'Alice', active: true };
      mockGame.setPlayerActive.mockReturnValue(false);

      component.togglePlayer(player);

      expect(mockToast.show).toHaveBeenCalledWith('At least 2 active players required', 'error');
      expect(player.active).toBe(true);
    });
  });

  describe('getValueClass', () => {
    it('should return win for positive value', () => {
      expect(component.getValueClass(10)).toBe('win');
    });

    it('should return loss for negative value', () => {
      expect(component.getValueClass(-5)).toBe('loss');
    });

    it('should return empty for zero', () => {
      expect(component.getValueClass(0)).toBe('');
    });
  });

  describe('exportAsImage', () => {
    it('should export scorecard as image', async () => {
      const mockCanvas = { toDataURL: jest.fn().mockReturnValue('data:image/png;base64,test') };
      jest.mocked(html2canvas).mockResolvedValue(mockCanvas as any);

      const mockLink = { download: '', href: '', click: jest.fn() };
      const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => mockLink as any);

      await component.exportAsImage();

      expect(html2canvas).toHaveBeenCalledWith(component.scorecard.nativeElement);
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith();
      expect(mockLink.download).toBe(`${component.username}-scorecard.png`);
      expect(mockLink.click).toHaveBeenCalled();

      createElementSpy.mockRestore();
    });
  });

  describe('addPlayer', () => {
    it('should add a new player successfully', () => {
      mockDialogRef.afterClosed.mockReturnValue(of('Bob'));
      mockGame.addPlayer.mockReturnValue(undefined);
      mockGame.getPlayers.mockReturnValue([{ name: 'Alice', active: true }, { name: 'Bob', active: true }]);
      component.players = [{ name: 'Alice', active: true }];

      component.addPlayer();

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockGame.addPlayer).toHaveBeenCalledWith('Bob');
      expect(component.players).toEqual([{ name: 'Alice', active: true }, { name: 'Bob', active: true }]);
      expect(mockToast.show).toHaveBeenCalledWith('Player Bob added', 'success');
    });

    it('should not add if no name provided', () => {
      mockDialogRef.afterClosed.mockReturnValue(of(''));

      component.addPlayer();

      expect(mockGame.addPlayer).not.toHaveBeenCalled();
    });
  });

  describe('addRound', () => {
    it('should add a round with winner', () => {
      component.lossPerHead = 10;
      mockGame.getActivePlayers.mockReturnValue(['Alice', 'Bob']);
      mockDialogRef.afterClosed.mockReturnValue(of('Alice'));
      mockGame.addRound.mockReturnValue(true);

      component.addRound();

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockGame.addRound).toHaveBeenCalledWith('Alice', 10);
      expect(mockGame.getRounds).toHaveBeenCalled();
      expect(mockGame.getTotals).toHaveBeenCalled();
    });

    it('should show error if no loss per head', () => {
      component.lossPerHead = null;

      component.addRound();

      expect(mockToast.show).toHaveBeenCalledWith('Select loss per head', 'error');
    });

    it('should show error if less than 2 active players', () => {
      component.lossPerHead = 10;
      mockGame.getActivePlayers.mockReturnValue(['Alice']);

      component.addRound();

      expect(mockToast.show).toHaveBeenCalledWith('At least 2 active players required', 'error');
    });
  });

  describe('editRound', () => {
    it('should update round winner', () => {
      const round = { winner: 'Alice', playersInRound: ['Alice', 'Bob'], results: {}, lossPerHead: 10 };
      component.rounds = [round];
      mockDialogRef.afterClosed.mockReturnValue(of('Bob'));
      mockGame.updateRound.mockReturnValue(true);

      component.editRound(0);

      expect(mockDialog.open).toHaveBeenCalled();
      expect(mockGame.updateRound).toHaveBeenCalledWith(0, 'Bob');
      expect(mockGame.getRounds).toHaveBeenCalled();
      expect(mockGame.getTotals).toHaveBeenCalled();
    });
  });

  describe('shareScore', () => {
    it('should share scorecard if supported', async () => {
      const mockCanvas = { toBlob: jest.fn((callback) => callback(new Blob())) };
      jest.mocked(html2canvas).mockResolvedValue(mockCanvas as any);
      const shareMock = jest.fn().mockResolvedValue(undefined);
      const canShareMock = jest.fn().mockReturnValue(true);
      Object.defineProperty(globalThis, 'navigator', {
        value: { ...(globalThis as any).navigator, share: shareMock, canShare: canShareMock },
        configurable: true
      });

      await component.shareScore();

      expect(html2canvas).toHaveBeenCalledWith(component.scorecard.nativeElement);
      expect(canShareMock).toHaveBeenCalledWith({ files: expect.any(Array) });
      expect(shareMock).toHaveBeenCalled();
    });

    it('should show error if sharing not supported', async () => {
      const mockCanvas = { toBlob: jest.fn((callback) => callback(new Blob())) };
      jest.mocked(html2canvas).mockResolvedValue(mockCanvas as any);
      Object.defineProperty(globalThis, 'navigator', {
        value: { ...(globalThis as any).navigator, share: undefined },
        configurable: true
      });

      await component.shareScore();

      expect(mockToast.show).toHaveBeenCalledWith('Sharing not supported on this device', 'error');
    });
  });
});