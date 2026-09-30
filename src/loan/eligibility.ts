import { Employee } from '../types/employee';
import { Loan } from '../types/loan';
import { calculateEMI } from './emi';

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
}

export function checkEligibility(
  employee: Employee,
  requestedPrincipal: number,
  annualInterestRate: number,
  tenureMonths: number,
  existingLoans: Loan[] = []
): EligibilityResult {
  const reasons: string[] = [];

  // Rule 1: minimum tenure at company (6 months)
  const monthsEmployed =
    (Date.now() - employee.joiningDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
  if (monthsEmployed < 6) {
    reasons.push('Employee must have at least 6 months of tenure');
  }

  // Rule 2: no other active loan
  const hasActiveLoan = existingLoans.some(
    (loan) => loan.employeeId === employee.id && loan.status === 'approved'
  );
  if (hasActiveLoan) {
    reasons.push('Employee already has an active loan');
  }

  // Rule 3: DTI cap — new EMI must be ≤ 40% of monthly salary
  const requestedEMI = calculateEMI(requestedPrincipal, annualInterestRate, tenureMonths);
  const dtiRatio = requestedEMI / employee.monthlySalary;
  if (dtiRatio > 0.4) {
    reasons.push('Requested EMI exceeds 40% of monthly salary');
  }

  // Rule 4: optional credit score check
  if (employee.creditScore !== undefined && employee.creditScore < 600) {
    reasons.push('Credit score below minimum threshold (600)');
  }

  return {
    eligible: reasons.length === 0,
    reasons,
  };
}