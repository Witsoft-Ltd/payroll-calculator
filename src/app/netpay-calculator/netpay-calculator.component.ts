import {FormControl, Validators} from '@angular/forms';
import { KenyanPayslip } from './Payslip';
import { PayrollCalculatorService } from './../payroll-calculator.service';
import { Component, Input, OnInit } from '@angular/core';
import { TaxTable } from './TaxTable';
import { NSSFRates, HousingType } from './Enums';

@Component({
  selector: 'app-netpay-calculator',
  templateUrl: './netpay-calculator.component.html',
  styleUrls: ['./netpay-calculator.component.css']
})
export class NetpayCalculatorComponent implements OnInit {

  @Input() UseCoronaRates: string;


  PayrollCalculator: PayrollCalculatorService;
  private oldRates: Array<TaxTable>;
  private coronaRates: Array<TaxTable>;
  private nhifRates: Array<TaxTable>;
  Payslip: KenyanPayslip;
  grosspayField = new FormControl('', [Validators.required, Validators.min(1)]);

  constructor(payrollCalculator: PayrollCalculatorService) {
    this.PayrollCalculator = payrollCalculator;
    this.PayrollCalculator.HousingType = HousingType.BenefitNotGiven;
    this.PayrollCalculator.NSSFRateType = NSSFRates.OldRates;

    this.oldRates = [
      {StartingFrom: 0, UpTo: 12298, ConstantValue: 0, Rate: 0.1},
      {StartingFrom: 12298.1, UpTo: 23885, ConstantValue: 1229.8, Rate: 0.15},
      {StartingFrom: 23885.1, UpTo: 35472, ConstantValue: 2967.85, Rate: 0.2},
      {StartingFrom: 35472.1, UpTo: 47059, ConstantValue: 5285.25, Rate: 0.25},
      {StartingFrom: 47059.1, UpTo: 0, ConstantValue: 8181.95, Rate: 0.3}
    ];

    this.coronaRates = [
      {StartingFrom: 0, UpTo: 24000, ConstantValue: 0, Rate: 0.1},
      {StartingFrom: 24000.1, UpTo: 40667, ConstantValue: 2400, Rate: 0.15},
      {StartingFrom: 40667.1, UpTo: 57333, ConstantValue: 4900.05, Rate: 0.2},
      {StartingFrom: 57333.1, UpTo: 0, ConstantValue: 8233.45, Rate: 0.25}
    ];

    this.nhifRates = [
      {StartingFrom: 0, UpTo: 5999, ConstantValue: 150, Rate: 0},
      {StartingFrom: 6000, UpTo: 7999, ConstantValue: 300, Rate: 0},
      {StartingFrom: 8000, UpTo: 11999, ConstantValue: 400, Rate: 0},
      {StartingFrom: 12000, UpTo: 14999, ConstantValue: 500, Rate: 0},
      {StartingFrom: 15000, UpTo: 19999, ConstantValue: 600, Rate: 0},
      {StartingFrom: 20000, UpTo: 24999, ConstantValue: 750, Rate: 0},
      {StartingFrom: 25000, UpTo: 29999, ConstantValue: 850, Rate: 0},
      {StartingFrom: 30000, UpTo: 34999, ConstantValue: 900, Rate: 0},
      {StartingFrom: 35000, UpTo: 39999, ConstantValue: 950, Rate: 0},
      {StartingFrom: 40000, UpTo: 44999, ConstantValue: 1000, Rate: 0},
      {StartingFrom: 45000, UpTo: 49999, ConstantValue: 1100, Rate: 0},
      {StartingFrom: 50000, UpTo: 59999, ConstantValue: 1200, Rate: 0},
      {StartingFrom: 60000, UpTo: 69999, ConstantValue: 1300, Rate: 0},
      {StartingFrom: 70000, UpTo: 79999, ConstantValue: 1400, Rate: 0},
      {StartingFrom: 80000, UpTo: 89999, ConstantValue: 1500, Rate: 0},
      {StartingFrom: 90000, UpTo: 99999, ConstantValue: 1600, Rate: 0},
      {StartingFrom: 100000, UpTo: 0, ConstantValue: 1700, Rate: 0}
    ];


  }

  HousingTypes = [
    {id: 1, name: 'Benefit not given'},
    {id: 2, name: 'Employer\'s Owned House'},
    {id: 3, name: 'Employer\'s Rented House'},
    {id: 4, name: 'Agriculture Farm'},
    {id: 5, name: 'House to Non full time service Director'},
  ];

  NSSFRates = [
    {id: 1, name: 'Tier I & II'},
    {id: 2, name: 'Tier I'},
    {id: 3, name: 'Old Rates'}
  ];

  ShowPayslip = false;

  getErrorMessage() {
    if (this.grosspayField.hasError('required')) {
      return 'You must enter a value';
    }
    return this.grosspayField.hasError('min') ? 'Value must be atleast one' : '';
  }

  ClearForm(){
    this.PayrollCalculator.GrossPay = null;
    this.PayrollCalculator.Benefits = 0;
    this.PayrollCalculator.HouseValue = 0;
    this.PayrollCalculator.RentRecovered = 0;
    this.PayrollCalculator.Pension = 0;
    this.PayrollCalculator.MortgageInterest = 0;
    this.PayrollCalculator.InsuranceRelief = 0;
  }

  CalculateNetPay(){
    this.PayrollCalculator.NSSFLowerEarningLimit = 6000;
    this.PayrollCalculator.NSSFUpperEarningLimit = 18000;
    this.PayrollCalculator.PermissibleLimit = 20000;
    if (this.UseCoronaRates === 'yes') {
      this.Payslip = this.PayrollCalculator.GetPayslip(this.coronaRates, 2400, this.nhifRates);
    } else {
      this.Payslip = this.PayrollCalculator.GetPayslip(this.oldRates, 1408, this.nhifRates);
    }
    this.ShowPayslip = true;
  }

  IntializeCalculator() {
    this.ClearForm();
    this.ShowPayslip = false;
  }

  ngOnInit(): void {
  }

}
