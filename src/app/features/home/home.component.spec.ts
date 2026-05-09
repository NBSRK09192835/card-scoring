import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SessionFacade } from '../../core/facades/session-facade.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockRouter: { navigate: jest.Mock };
  let mockSession: {
    clearSession: jest.Mock;
    getUsername: jest.Mock;
  };

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn()
    };
    mockSession = {
      clearSession: jest.fn(),
      getUsername: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SessionFacade, useValue: mockSession }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('enterAsGuest', () => {
    it('should navigate to /guest', () => {
      component.enterAsGuest();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/guest']);
    });
  });

  describe('clearStoredData', () => {
    it('should call session.clearSession', () => {
      component.clearStoredData();
      expect(mockSession.clearSession).toHaveBeenCalled();
    });
  });

  describe('hasActiveSession', () => {
    it('should return true when username exists', () => {
      mockSession.getUsername.mockReturnValue('testuser');
      expect(component.hasActiveSession()).toBe(true);
    });

    it('should return false when no username', () => {
      mockSession.getUsername.mockReturnValue('');
      expect(component.hasActiveSession()).toBe(false);
    });
  });

  describe('resumeSession', () => {
    it('should navigate to encoded username route when username exists', () => {
      const username = 'test user';
      mockSession.getUsername.mockReturnValue(username);
      component.resumeSession();
      expect(mockRouter.navigate).toHaveBeenCalledWith([`/${encodeURIComponent(username)}`]);
    });

    it('should not navigate when no username', () => {
      mockSession.getUsername.mockReturnValue('');
      component.resumeSession();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });
});