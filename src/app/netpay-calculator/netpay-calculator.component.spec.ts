import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetpayCalculatorComponent } from './netpay-calculator.component';

describe('NetpayCalculatorComponent', () => {
  let component: NetpayCalculatorComponent;
  let fixture: ComponentFixture<NetpayCalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetpayCalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetpayCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
