import { TestBed } from '@angular/core/testing';

import { LectorBarraService } from './lector-barra.service';

describe('LectorBarraService', () => {
  let service: LectorBarraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LectorBarraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
