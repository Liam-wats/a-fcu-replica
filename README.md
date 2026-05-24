# A+ Federal Credit Union — Demo Web App

> **This is a demo project built as a boot camp capstone project. It is not affiliated with, endorsed by, or representative of the real A+ Federal Credit Union. All data, accounts, and transactions shown are fictional.**

## About

A full-stack online banking web application built to demonstrate skills learned throughout the boot camp program. The app simulates a credit union's public marketing site and member online banking portal.

## Tech Stack

- **Frontend:** React 19, TypeScript, TanStack Router, TanStack Query, Tailwind CSS 4, Shadcn/Radix UI
- **Backend:** Node.js, Express 5
- **Database:** PostgreSQL
- **Auth:** JWT (JSON Web Tokens)
- **Other:** nodemailer, jsPDF, multer

## Features

- Public marketing pages (accounts, loans, services, business, guidance)
- Member registration and login with rate limiting
- Online banking dashboard (balances, transactions, statements)
- Fund transfers with email notification
- PDF and CSV statement export
- Admin panel for membership management
- Security hardening (CSP headers, HSTS, robots.txt, login rate limiter)

## Running Locally

```bash
npm install
npm run dev
```

The app starts two servers concurrently:
- **Express API** on port `3001`
- **Vite dev server** on port `5000` (proxies `/api` to Express)

## Disclaimer

This project is for educational purposes only. No real financial data is used or stored. The A+ Federal Credit Union name and branding assets are used solely for demonstration purposes in an academic setting.
