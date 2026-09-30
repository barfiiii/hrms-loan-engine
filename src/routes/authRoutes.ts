import { Router } from 'express';
import { getEmployeeById } from '../store/employeeStore';
import { comparePassword } from '../auth/hash';
import { signToken } from '../auth/jwt';

const router = Router();

router.post('/login', async (req, res) => {
  const { employeeId, password } = req.body;
  const employee = await getEmployeeById(employeeId);
  if (!employee) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const valid = await comparePassword(password, employee.password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = signToken({ employeeId: employee.id, role: employee.role });
  res.json({ token });
});

export default router;