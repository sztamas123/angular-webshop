import { TestBed } from '@angular/core/testing';

import { CartFormService } from './cart-form.service';

describe('CartFormService', () => {
  let service: CartFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
