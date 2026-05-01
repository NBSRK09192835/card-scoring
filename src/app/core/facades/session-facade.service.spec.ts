import { TestBed } from '@angular/core/testing';

import { SessionFacade } from './session-facade.service';

describe('SessionFacadeService', () => {
  let service: SessionFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
