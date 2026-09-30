import { Router } from 'express';
import { addEmployee, getAllEmployees, getEmployeeById } from '../store/employeeStore';
import { hashPassword } from '../auth/hash';

const router = Router();

router.post('/', async (req, res) => {
  const { id, name, monthlySalary, joiningDate, creditScore, password, role } = req.body;
  const hashed = await hashPassword(password);
  const employee = await addEmployee({
    id,
    name,
    monthlySalary,
    joiningDate: new Date(joiningDate),
    creditScore: creditScore ?? null,
    password: hashed,
    role: role || 'employee',
  });
  const { password: _, ...safeEmployee } = employee;
  res.status(201).json(safeEmployee);
});

router.get('/', async (req, res) => {
  const employees = await getAllEmployees();
  res.json(employees.map(({ password, ...rest }) => rest));
});

router.get('/:id', async (req, res) => {
  const employee = await getEmployeeById(req.params.id);
  if (!employee) {
    return res.status(404).json({ error: 'Employee not found' });
  }
  const { password, ...safeEmployee } = employee;
  res.json(safeEmployee);
});

export default router;