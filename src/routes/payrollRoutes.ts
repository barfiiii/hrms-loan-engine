import { Router } from 'express';
import { runPayrollCycle } from '../payroll/runCycle';
import { requireAuth, requireRole } from '../auth/middleware';

const router = Router();

router.post('/run', requireAuth, requireRole('hr'), async (req, res) => {
  const { month } = req.body;
  const records = await runPayrollCycle(month);
  res.json(records);
});

export default router;