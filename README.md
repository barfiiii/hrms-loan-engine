# HRMS Loan Engine

A TypeScript backend for an HR system feature: employees can request a salary loan/advance, HR reviews and approves it, and the EMI is automatically deducted from salary every payroll cycle until repaid.

## Features

- **EMI calculator** — reducing-balance interest formula
- **Amortization schedule** — month-by-month principal/interest/balance breakdown
- **Eligibility engine** — tenure, DTI ratio, active-loan, and credit score checks
- **REST API** — Express routes for employees, loans, and payroll
- **Persistent storage** — PostgreSQL via Prisma ORM
- **Payroll cycle job** — deducts EMIs from approved loans, updates balances, auto-closes paid-off loans
- **Authentication** — JWT-based login with role-based access control (employee vs HR)
- **Frontend** — a minimal HTML form to submit loan requests against the live API

## Tech stack

| Layer | Choice |
|---|---|
| Language | TypeScript (strict mode) |
| Runtime | Node.js |
| Backend framework | Express |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Auth | JWT (jsonwebtoken) + bcrypt password hashing |
| Frontend | Plain HTML/JS |

## Project structure

```
src/
  types/      Employee, Loan, AmortizationEntry, PayrollRecord interfaces
  loan/       emi.ts, amortization.ts, eligibility.ts
  payroll/    runCycle.ts
  auth/       hash.ts, jwt.ts, middleware.ts
  store/      Prisma-backed data access (employeeStore, loanStore)
  routes/     Express route handlers
  web/        static frontend (index.html)
prisma/
  schema.prisma
  migrations/
```

## Core logic

**EMI formula (reducing balance):**
```
r = annualInterestRate / 12
EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)
```

**Eligibility rules:**
- Minimum 6 months tenure at the company
- No existing active (approved) loan
- Requested EMI ≤ 40% of monthly salary (DTI cap)
- Credit score ≥ 600, if provided

## API endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/employees` | — | Create an employee (hashes password) |
| GET | `/employees` | — | List all employees |
| GET | `/employees/:id` | — | Get one employee |
| POST | `/auth/login` | — | Log in, returns a JWT |
| POST | `/loans` | — | Request a loan (runs eligibility check) |
| GET | `/loans/:id` | — | Get one loan |
| GET | `/loans/employee/:employeeId` | — | Get all loans for an employee |
| PATCH | `/loans/:id/approve` | HR only | Approve a pending loan |
| POST | `/payroll/run` | HR only | Run a payroll cycle, deduct EMIs |

## Setup

1. Clone the repo and install dependencies:
   ```
   npm install
   ```
2. Create a `.env` file:
   ```
   DATABASE_URL="your-postgres-connection-string"
   JWT_SECRET="your-secret-key"
   ```
3. Run migrations:
   ```
   npx prisma migrate dev
   ```
4. Start the dev server:
   ```
   npm run dev
   ```
5. Open `http://localhost:3000/index.html` for the frontend, or use the API directly.

## What I learned building this

- Modeling a real business process (loan lifecycle) as TypeScript types and pure functions before touching a database or API
- Wiring an Express API to a Prisma/PostgreSQL backend, including schema migrations and handling schema changes against existing data
- Implementing JWT auth and role-based route protection from scratch
- Debugging real integration issues: async/await conversion when swapping in-memory storage for a database, middleware ordering (body-parser before routes), and stale server processes during development