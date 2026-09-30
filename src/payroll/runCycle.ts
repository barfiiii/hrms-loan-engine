import { prisma } from '../store/prismaClient';
import { calculateEMI } from '../loan/emi';

export async function runPayrollCycle(month: string) {
  const employees = await prisma.employee.findMany({
    include: { loans: { where: { status: 'approved' } } },
  });

  const results = [];

  for (const employee of employees) {
    let totalDeduction = 0;

    for (const loan of employee.loans) {
      if (!loan.remainingBalance || loan.remainingBalance <= 0) continue;

      const emi = calculateEMI(loan.principal, loan.annualInterestRate, loan.tenureMonths);
      const deduction = Math.min(emi, loan.remainingBalance);
      const newBalance = Math.round((loan.remainingBalance - deduction) * 100) / 100;

      await prisma.loan.update({
        where: { id: loan.id },
        data: {
          remainingBalance: newBalance,
          status: newBalance <= 0 ? 'closed' : 'approved',
        },
      });

      totalDeduction += deduction;
    }

    const netSalary = employee.monthlySalary - totalDeduction;

    const record = await prisma.payrollRecord.create({
      data: {
        employeeId: employee.id,
        month,
        grossSalary: employee.monthlySalary,
        loanDeduction: totalDeduction,
        netSalary,
      },
    });

    results.push(record);
  }

  return results;
}