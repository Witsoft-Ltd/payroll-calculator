import { NSSFRates } from './Enums';

export class KenyanPayslip {
  GrossPay: number;
  Benefits: number;
  HouseBenefit: number;
  RentRecovered: number;
  NSSFRateType: NSSFRates;

  public get TotalGrossPay(): number{
    return this.GrossPay + this.Benefits + this.HouseBenefit;
  }

  NSSFTierOneAmount: number;
  NSSFTierTwoAmount: number;

  public get NSSFAmount(): number {
    return this.NSSFTierOneAmount + this.NSSFTierTwoAmount;
  }

  Pension: number;
  PermissibleLimit: number;

  public get ActualContribution(): number {
    return this.NSSFAmount + this.Pension;
  }

  public get ActualContributionBenefit(): number {
    if (this.GrossPay < 0) {
      return 0;
    }
    let lowestValue = this.ActualContribution;
    if (lowestValue > (this.GrossPay * 0.3)) {
      lowestValue = this.GrossPay * 0.3;
    }
    if (lowestValue > this.PermissibleLimit) {
      lowestValue = this.PermissibleLimit;
    }
    return lowestValue;
  }

  public MortgageInterest: number;

  public get TotalAllowableDeductions(): number {
    if (this.MortgageInterest > 87000) {
      return this.ActualContributionBenefit + 87000;
    } else{
      return this.ActualContributionBenefit + this.MortgageInterest;
    }
  }

  public get TaxablePay(): number {
    if (this.TotalAllowableDeductions > this.TotalGrossPay) {
      return 0;
    }
    return this.TotalGrossPay - this.TotalAllowableDeductions;
  }

  TaxCharged: number;

  MPRF: number;
  InsuranceRelief: number;

  public get TotalRelief(): number {
    return this.MPRF + this.InsuranceRelief;
  }

  public get PAYE(): number {
    if (this.TotalRelief > this.TaxCharged) {
      return 0;
    }
    return this.TaxCharged - this.TotalRelief;
  }

  NHIF: number;

  public get TotalDeductions(): number {
    return this.NHIF + this.PAYE + this.ActualContribution + this.RentRecovered;
  }

  public get Netpay(): number {
    return this.GrossPay - this.TotalDeductions;
  }
}
