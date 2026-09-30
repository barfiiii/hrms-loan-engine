import { prisma } from './prismaClient';
import { Employee } from '../types/employee';

export async function addEmployee(employee: Employee): Promise<Employee> {
  return prisma.employee.create({ data: employee });
}

export async function getEmployeeById(id: string): Promise<Employee | null> {
  return prisma.employee.findUnique({ where: { id } });
}

export async function getAllEmployees(): Promise<Employee[]> {
  return prisma.employee.findMany();
}