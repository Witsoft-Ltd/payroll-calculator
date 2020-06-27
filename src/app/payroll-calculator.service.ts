import { KenyanPayslip } from './netpay-calculator/Payslip';
import { TaxTable } from './netpay-calculator/TaxTable';
import { Injectable } from '@angular/core';
import { NSSFRates, HousingType } from './netpay-calculator/Enums';

@Injectable({
  providedIn: 'root'
})
export class PayrollCalculatorService {

  constructor() {
  }

  // From userinput fields
  GrossPay: number;
  Benefits: number;
  HousingType: HousingType;
  HouseValue: number;
  RentRecovered: number;
  NSSFRateType: NSSFRates;
  Pension: number;
  MortgageInterest: number;
  InsuranceRelief: number;

  // Add when calling
  PermissibleLimit: number;
  NSSFLowerEarningLimit: number;
  NSSFUpperEarningLimit: number;

  private nssfTierOneAmount = 0;
  private nssfTierTwoAmount = 0;

   GetPayslip(
     taxTable: Array<TaxTable>,
     taxRelief: number,
     nhifTable: Array<TaxTable>): KenyanPayslip
  {
    const payslip = new KenyanPayslip();
    payslip.GrossPay = isNaN(this.GrossPay) ? 0 : this.GrossPay;
    payslip.Benefits = isNaN(this.Benefits) ? 0 : this.Benefits;
    payslip.HouseBenefit = this.GetHouseBenefit();
    payslip.RentRecovered = isNaN(this.RentRecovered) ? 0 : this.RentRecovered;
    this.ComputeNSSFAmount();
    payslip.NSSFRateType = this.NSSFRateType;
    payslip.NSSFTierOneAmount = this.nssfTierOneAmount;
    payslip.NSSFTierTwoAmount = this.nssfTierTwoAmount;
    payslip.Pension = isNaN(this.Pension) ? 0 : this.Pension;
    payslip.PermissibleLimit = this.PermissibleLimit;
    payslip.MortgageInterest = isNaN(this.MortgageInterest) ? 0 : this.MortgageInterest;
    payslip.TaxCharged = this.ComputeValueFromTable(taxTable, payslip.TaxablePay);
    payslip.MPRF = taxRelief;
    payslip.InsuranceRelief = isNaN(this.InsuranceRelief) ? 0 : this.InsuranceRelief;
    payslip.NHIF = this.ComputeValueFromTable(nhifTable, payslip.GrossPay);

    return payslip;
   }

   private GetHouseBenefit(): number {
    let result = 0;
    const nanHouseValue = isNaN(this.HouseValue) ? 0 : this.HouseValue;
    const nanRentRecovered = isNaN(this.RentRecovered) ? 0 : this.RentRecovered;
    switch (isNaN(this.HousingType) ? 1 : this.HousingType) {
      case HousingType.EmployerOwnedHouse:
       case HousingType.EmployerRentedHouse:
        if (((this.GrossPay * 0.15) - nanRentRecovered) >
            (nanHouseValue - nanRentRecovered)) {
          result = (this.GrossPay * 0.15) - nanRentRecovered;
        } else {
          result = nanHouseValue - nanRentRecovered;
        }
        break;
       case HousingType.AgricultralFarm:
         result = (this.GrossPay * 0.1);
         break;
    }

    return result;
   }

  private ComputeValueFromTable(taxTable: Array<TaxTable>, valueToCheck: number): number {
    let result = 0;
    for (const tableRow of taxTable) {
      if (tableRow.UpTo !== 0) {
        if (tableRow.StartingFrom <= valueToCheck && tableRow.UpTo >= valueToCheck) {
          result = ((valueToCheck - tableRow.StartingFrom) * tableRow.Rate) + tableRow.ConstantValue;
        }
      } else {
        if (tableRow.StartingFrom <= valueToCheck) {
          result = ((valueToCheck - tableRow.StartingFrom) * tableRow.Rate) + tableRow.ConstantValue;
        }
      }
    }
    return result;
  }

  private ComputeNSSFAmount(){
    switch (this.NSSFRateType) {
      case NSSFRates.OldRates:
        this.nssfTierTwoAmount = 0;
        this.nssfTierOneAmount = this.GrossPay * 0.05;
        if (this.nssfTierOneAmount > 200) {
          this.nssfTierOneAmount = 200;
        } else if (this.nssfTierOneAmount < 100) {
          this.nssfTierOneAmount = 100;
        }
        break;
      case NSSFRates.TierIPension:
        this.nssfTierTwoAmount = 0;
        const pensionableEarnings = (this.GrossPay > this.NSSFLowerEarningLimit) ?
                                      this.NSSFLowerEarningLimit : this.GrossPay;
        this.nssfTierOneAmount = pensionableEarnings * 0.06;
        break;
      case NSSFRates.TierIIPension:
        const tierIPensionableEarning = (this.GrossPay > this.NSSFLowerEarningLimit) ?
                                          this.NSSFLowerEarningLimit : this.GrossPay;
        this.nssfTierOneAmount = tierIPensionableEarning * 0.06;

        const tierIIPensionableEarning = ((this.GrossPay - this.NSSFLowerEarningLimit) >
                                          (this.NSSFUpperEarningLimit - this.NSSFLowerEarningLimit)) ?
                                          (this.NSSFUpperEarningLimit - this.NSSFLowerEarningLimit) :
                                          (this.GrossPay - this.NSSFLowerEarningLimit);
        if (tierIIPensionableEarning > 0) {
          this.nssfTierTwoAmount = tierIIPensionableEarning * 0.06;
        }
        break;
    }
  }

}

