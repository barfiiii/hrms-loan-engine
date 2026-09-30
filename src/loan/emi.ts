export function calculateEMI(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number
): number {
  const monthlyRate = annualInterestRate / 12;

  if (monthlyRate === 0) {
    return principal / tenureMonths;
  }

  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);

  return Math.round(emi * 100) / 100;
}