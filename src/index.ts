import express from 'express';
import employeeRoutes from './routes/employeeRoutes';
import loanRoutes from './routes/loanRoutes';
import payrollRoutes from './routes/payrollRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
app.use(express.json());
app.use(express.static('src/web'));
app.use('/auth', authRoutes);
app.use('/payroll', payrollRoutes);
app.use('/employees', employeeRoutes);
app.use('/loans', loanRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});