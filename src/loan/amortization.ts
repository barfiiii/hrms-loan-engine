import { calculateEMI } from './emi';
import { AmortizationEntry } from '../types/amortization';

export function generateAmortizationSchedule(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number
): AmortizationEntry[] {
  const monthlyRate = annualInterestRate / 12;
  const emi = calculateEMI(principal, annualInterestRate, tenureMonths);

  const schedule: AmortizationEntry[] = [];
  let remainingBalance = principal;

  for (let month = 1; month <= tenureMonths; month++) {
    const interestPaid = Math.round(remainingBalance * monthlyRate * 100) / 100;
    let principalPaid = Math.round((emi - interestPaid) * 100) / 100;

    // Last month: clear any leftover rounding difference
    if (month === tenureMonths) {
      principalPaid = remainingBalance;
    }

    remainingBalance = Math.round((remainingBalance - principalPaid) * 100) / 100;

    schedule.push({
      month,
      emi,
      principalPaid,
      interestPaid,
      remainingBalance: remainingBalance < 0 ? 0 : remainingBalance,
    });
  }

  return schedule;
}