import { Router } from 'express';
import { addLoan, getLoanById, getLoansByEmployee, updateLoanStatus } from '../store/loanStore';
import { getEmployeeById } from '../store/employeeStore';
import { checkEligibility } from '../loan/eligibility';
import { requireAuth, requireRole } from '../auth/middleware';

const router = Router();

router.post('/', async (req, res) => {
  const { id, employeeId, principal, annualInterestRate, tenureMonths, interestType } = req.body;

  const employee = await getEmployeeById(employeeId);
  if (!employee) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  const eligibility = checkEligibility(employee, principal, annualInterestRate, tenureMonths);
  if (!eligibility.eligible) {
    return res.status(400).json({ error: 'Not eligible', reasons: eligibility.reasons });
  }

  const loan = await addLoan({
    id,
    employeeId,
    principal,
    annualInterestRate,
    tenureMonths,
    interestType,
    status: 'pending',
    startDate: null,
  });

  res.status(201).json(loan);
});

router.get('/:id', async (req, res) => {
  const loan = await getLoanById(req.params.id);
  if (!loan) {
    return res.status(404).json({ error: 'Loan not found' });
  }
  res.json(loan);
});

router.get('/employee/:employeeId', async (req, res) => {
  const loans = await getLoansByEmployee(req.params.employeeId);
  res.json(loans);
});

router.patch('/:id/approve', requireAuth, requireRole('hr'), async (req, res) => {
const loan = await updateLoanStatus(String(req.params.id), 'approved');
  if (!loan) {
    return res.status(404).json({ error: 'Loan not found' });
  }
  res.json(loan);
});

export default router;