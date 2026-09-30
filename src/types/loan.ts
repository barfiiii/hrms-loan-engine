export type InterestType = 'flat' | 'reducing';
export type LoanStatus = 'pending' | 'approved' | 'rejected' | 'closed';

export interface Loan {
  id: string;
  employeeId: string;
  principal: number;
  annualInterestRate: number;
  tenureMonths: number;
  interestType: string;
  status: string;
  startDate: Date | null;
}