import { prisma } from './prismaClient';
import { Loan } from '../types/loan';

export async function addLoan(loan: Loan): Promise<Loan> {
  return prisma.loan.create({ data: loan });
}

export async function getLoanById(id: string): Promise<Loan | null> {
  return prisma.loan.findUnique({ where: { id } });
}

export async function getLoansByEmployee(employeeId: string): Promise<Loan[]> {
  return prisma.loan.findMany({ where: { employeeId } });
}

export async function updateLoanStatus(id: string, status: string): Promise<Loan | null> {
  const loan = await prisma.loan.findUnique({ where: { id } });
  if (!loan) return null;

  const data: any = { status };
  if (status === 'approved') {
    data.remainingBalance = loan.principal;
    data.startDate = new Date();
  }

  return prisma.loan.update({ where: { id }, data });
}


export async function getAllLoans(): Promise<Loan[]> {
  return prisma.loan.findMany();
}