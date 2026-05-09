import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GuestComponent } from './guest.component';
import { SessionFacade } from '../../core/facades/session-facade.service';
import { ToastService } from '../../core/services/toast/toast.service';

describe('GuestComponent', () => {
  let component: GuestComponent;
  let fixture: ComponentFixture<GuestComponent>;
  let sessionFacade: any;
  let toastService: any;
  let router: any;

  beforeEach(async () => {
    const sessionFacadeMock = {
      getUsername: jasmine.createSpy('getUsername'),
      setUsername: jasmine.createSpy('setUsername'),
      clearSession: jasmine.createSpy('clearSession')
    };

    const toastServiceMock = {
      show: jasmine.createSpy('show')
    };
    
    const routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [GuestComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: SessionFacade, useValue: sessionFacadeMock },
        { provide: ToastService, useValue: toastServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GuestComponent);
    component = fixture.componentInstance;
    sessionFacade = TestBed.inject(SessionFacade);
    toastService = TestBed.inject(ToastService);
    router = TestBed.inject(Router);
  });

  it('should create the guest component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form on first load', () => {
    sessionFacade.getUsername.and.returnValue('');
    fixture.detectChanges();

    expect(component.guestForm.get('username')?.value).toBe('');
  });

  describe('Form Initialization', () => {
    it('should populate form with existing username if not Guest', () => {
      sessionFacade.getUsername.and.returnValue('ExistingUser');
      fixture.detectChanges();

      expect(component.guestForm.get('username')?.value).toBe('ExistingUser');
    });

    it('should not populate form if existing username is Guest', () => {
      sessionFacade.getUsername.and.returnValue('Guest');
      fixture.detectChanges();

      expect(component.guestForm.get('username')?.value).toBe('');
    });

    it('should have username field required', () => {
      const usernameControl = component.guestForm.get('username');
      expect(usernameControl?.hasError('required')).toBe(true);
      
      usernameControl?.setValue('TestUser');
      expect(usernameControl?.hasError('required')).toBe(false);
    });
  });

  describe('startGuest Method', () => {
    beforeEach(() => {
      sessionFacade.getUsername.and.returnValue('');
    });

    it('should show error when username is empty', () => {
      component.guestForm.get('username')?.setValue('');
      component.startGuest();

      expect(toastService.show).toHaveBeenCalledWith(
        'Please enter a valid guest name.',
        'error'
      );
    });

    it('should show error when username is whitespace only', () => {
      component.guestForm.get('username')?.setValue('   ');
      component.startGuest();

      expect(toastService.show).toHaveBeenCalledWith(
        'Please enter a valid guest name.',
        'error'
      );
    });

    it('should mark form as touched when validation fails', () => {
      component.guestForm.get('username')?.setValue('');
      component.startGuest();

      expect(component.guestForm.touched).toBe(true);
    });

    it('should start guest session with valid username', () => {
      component.guestForm.get('username')?.setValue('NewUser');
      component.startGuest();

      expect(sessionFacade.setUsername).toHaveBeenCalledWith('NewUser');
      expect(toastService.show).toHaveBeenCalledWith(
        'Guest session started as NewUser',
        'success'
      );
    });

    it('should trim username before processing', () => {
      component.guestForm.get('username')?.setValue('  TestUser  ');
      component.startGuest();

      expect(sessionFacade.setUsername).toHaveBeenCalledWith('TestUser');
    });

    it('should navigate to user-specific route after starting session', () => {
      component.guestForm.get('username')?.setValue('TestUser');
      component.startGuest();

      expect(router.navigate).toHaveBeenCalledWith(['/TestUser']);
    });

    it('should encode username in route', () => {
      component.guestForm.get('username')?.setValue('User Name');
      component.startGuest();

      expect(router.navigate).toHaveBeenCalledWith(['/User%20Name']);
    });

    it('should use provided username over form value', () => {
      component.guestForm.get('username')?.setValue('FormUser');
      component.startGuest('ParameterUser');

      expect(sessionFacade.setUsername).toHaveBeenCalledWith('ParameterUser');
      expect(router.navigate).toHaveBeenCalledWith(['/ParameterUser']);
    });
  });

  describe('Existing Session Handling', () => {
    it('should show error when same username already exists', () => {
      sessionFacade.getUsername.and.returnValue('ExistingUser');
      component.guestForm.get('username')?.setValue('ExistingUser');
      component.startGuest();

      expect(toastService.show).toHaveBeenCalledWith(
        '"ExistingUser" is already active.',
        'error'
      );
    });

    it('should be case-insensitive when checking for duplicate username', () => {
      sessionFacade.getUsername.and.returnValue('existinguser');
      component.guestForm.get('username')?.setValue('ExistingUser');
      component.startGuest();

      expect(toastService.show).toHaveBeenCalledWith(
        '"ExistingUser" is already active.',
        'error'
      );
    });

    it('should prompt for replacement when session exists', () => {
      sessionFacade.getUsername.and.returnValue('OldUser');
      spyOn(window, 'confirm').and.returnValue(true);

      component.guestForm.get('username')?.setValue('NewUser');
      component.startGuest();

      expect(window.confirm).toHaveBeenCalledWith(
        'Session already exists as "OldUser". Replace it?'
      );
    });

    it('should not replace session when user declines', () => {
      sessionFacade.getUsername.and.returnValue('OldUser');
      spyOn(window, 'confirm').and.returnValue(false);

      component.guestForm.get('username')?.setValue('NewUser');
      component.startGuest();

      expect(sessionFacade.clearSession).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should clear session and create new one when user confirms replacement', () => {
      sessionFacade.getUsername.and.returnValue('OldUser');
      spyOn(window, 'confirm').and.returnValue(true);

      component.guestForm.get('username')?.setValue('NewUser');
      component.startGuest();

      expect(sessionFacade.clearSession).toHaveBeenCalled();
      expect(sessionFacade.setUsername).toHaveBeenCalledWith('NewUser');
      expect(router.navigate).toHaveBeenCalledWith(['/NewUser']);
    });

    it('should show success toast after replacing session', () => {
      sessionFacade.getUsername.and.returnValue('OldUser');
      spyOn(window, 'confirm').and.returnValue(true);

      component.guestForm.get('username')?.setValue('NewUser');
      component.startGuest();

      expect(toastService.show).toHaveBeenCalledWith(
        'Guest session started as NewUser',
        'success'
      );
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      sessionFacade.getUsername.and.returnValue('');
    });

    it('should handle username with special characters', () => {
      component.guestForm.get('username')?.setValue('User@123!');
      component.startGuest();

      expect(sessionFacade.setUsername).toHaveBeenCalledWith('User@123!');
      expect(router.navigate).toHaveBeenCalledWith(['/User%40123!']);
    });

    it('should handle very long username', () => {
      const longName = 'A'.repeat(100);
      component.guestForm.get('username')?.setValue(longName);
      component.startGuest();

      expect(sessionFacade.setUsername).toHaveBeenCalledWith(longName);
    });

    it('should handle single character username', () => {
      component.guestForm.get('username')?.setValue('A');
      component.startGuest();

      expect(sessionFacade.setUsername).toHaveBeenCalledWith('A');
    });

    it('should not call API methods if validation fails', () => {
      component.guestForm.get('username')?.setValue('');
      component.startGuest();

      expect(sessionFacade.setUsername).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Direct Method Call vs Form Submission', () => {
    beforeEach(() => {
      sessionFacade.getUsername.and.returnValue('');
    });

    it('should accept username as parameter when provided', () => {
      component.startGuest('DirectUser');

      expect(sessionFacade.setUsername).toHaveBeenCalledWith('DirectUser');
    });

    it('should use form value when parameter is not provided', () => {
      component.guestForm.get('username')?.setValue('FormUser');
      component.startGuest();

      expect(sessionFacade.setUsername).toHaveBeenCalledWith('FormUser');
    });

    it('should fall back to form value when parameter is empty string', () => {
      component.guestForm.get('username')?.setValue('FormUser');
      component.startGuest('');

      expect(sessionFacade.setUsername).toHaveBeenCalledWith('FormUser');
    });
  });
});
