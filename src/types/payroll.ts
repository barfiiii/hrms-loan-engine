export interface PayrollRecord {
  employeeId: string;
  month: string; // 'YYYY-MM'
  grossSalary: number;
  loanDeduction: number;
  netSalary: number;
}