import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ToastService, ToastType } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('show method', () => {
    it('should emit toast with message and type', (done) => {
      const message = 'Test message';
      const type: ToastType = 'success';

      service.toast$.subscribe(toast => {
        if (toast) {
          expect(toast.message).toBe(message);
          expect(toast.type).toBe(type);
          done();
        }
      });

      service.show(message, type);
    });

    it('should default to info type', (done) => {
      const message = 'Info message';

      service.toast$.subscribe(toast => {
        if (toast) {
          expect(toast.message).toBe(message);
          expect(toast.type).toBe('info');
          done();
        }
      });

      service.show(message);
    });

    it('should clear toast after duration', fakeAsync(() => {
      const message = 'Test message';
      const duration = 1000;

      service.show(message, 'info', duration);

      // Immediately after show, toast should be set
      let currentToast: any;
      service.toast$.subscribe(toast => currentToast = toast).unsubscribe();
      expect(currentToast).toEqual({ message, type: 'info' });

      // After duration, toast should be null
      tick(duration);
      service.toast$.subscribe(toast => currentToast = toast).unsubscribe();
      expect(currentToast).toBeNull();
    }));
  });
});
