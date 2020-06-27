import { TestBed } from '@angular/core/testing';

import { PayrollCalculatorService } from './payroll-calculator.service';

describe('PayrollCalculatorService', () => {
  let service: PayrollCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayrollCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
