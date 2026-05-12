import express from "express";
import cors from "cors";
import pg from "pg";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING || process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const JWT_SECRET = process.env.JWT_SECRET || "apfcu_dev_secret_please_change_in_production";
const JWT_EXPIRES = "8h";

// Auto-migrate: add login columns if missing
async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS membership_applications (
      id SERIAL PRIMARY KEY,
      reference_number TEXT UNIQUE NOT NULL,
      goals TEXT,
      first_name TEXT,
      last_name TEXT,
      email TEXT,
      phone TEXT,
      date_of_birth TEXT,
      ssn_last4 TEXT,
      street TEXT,
      apt TEXT,
      city TEXT,
      state TEXT,
      zip TEXT,
      account_type TEXT,
      login_id TEXT UNIQUE,
      password_hash TEXT,
      status TEXT DEFAULT 'pending',
      submitted_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    ALTER TABLE membership_applications
      ADD COLUMN IF NOT EXISTS login_id TEXT UNIQUE,
      ADD COLUMN IF NOT EXISTS password_hash TEXT
  `);
}

migrate().catch((err) => console.warn("DB migrate skipped:", err.message));

async function migrateAccountData() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS member_balances (
      login_id TEXT PRIMARY KEY,
      available_balance NUMERIC DEFAULT 0,
      current_balance NUMERIC DEFAULT 0,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS member_transactions (
      id SERIAL PRIMARY KEY,
      login_id TEXT NOT NULL,
      txn_date TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT DEFAULT 'Other',
      amount NUMERIC NOT NULL,
      txn_type TEXT DEFAULT 'debit',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS member_alerts (
      id SERIAL PRIMARY KEY,
      login_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      alert_type TEXT DEFAULT 'info',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}
migrateAccountData().catch((err) => console.warn("DB migrateAccountData skipped:", err.message));

function hashPassword(password) {
  return crypto.createHash("sha256").update(password + "apfcu_salt").digest("hex");
}

// ── JWT helpers ──────────────────────────────────────────────────────────────

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }
  try {
    req.user = jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Session expired. Please log in again." });
  }
}

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized." });
  }
  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET);
    if (payload.role !== "admin") {
      return res.status(403).json({ error: "Forbidden." });
    }
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Admin session expired." });
  }
}

// ── Email transporter ────────────────────────────────────────────────────────

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

// ── Express setup ────────────────────────────────────────────────────────────

const app = express();
app.use(cors());
app.use(express.json());

// ── Auth endpoints ───────────────────────────────────────────────────────────

// GET /api/auth/verify — validate a member JWT
app.get("/api/auth/verify", requireAuth, (req, res) => {
  res.json({ valid: true, loginId: req.user.loginId });
});

// POST /api/login — authenticate a member, return JWT
app.post("/api/login", async (req, res) => {
  const { loginId, password } = req.body;

  if (!loginId || !password) {
    return res.status(400).json({ error: "Login ID and password are required." });
  }

  const hash = hashPassword(password);

  try {
    const result = await pool.query(
      `SELECT id, login_id, first_name, last_name, email, account_type, status, reference_number
       FROM membership_applications
       WHERE login_id = $1 AND password_hash = $2`,
      [loginId, hash]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Incorrect Login ID or password. Please try again." });
    }

    const member = result.rows[0];

    if (member.status === "pending") {
      return res.status(403).json({
        error: "Your membership application is still under review. You'll receive an email once approved.",
        status: "pending",
      });
    }

    const token = signToken({ loginId: member.login_id, sub: member.id });

    return res.json({
      success: true,
      token,
      member: {
        loginId: member.login_id,
        firstName: member.first_name,
        lastName: member.last_name,
        email: member.email,
        accountType: member.account_type,
        referenceNumber: member.reference_number,
      },
    });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ error: "Login failed. Please try again later." });
  }
});

// POST /api/admin/login — verify admin password, return admin JWT
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: "Password required." });
  }
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return res.status(503).json({ error: "Admin access not configured." });
  }
  if (password !== adminPassword) {
    return res.status(401).json({ error: "Incorrect password. Please try again." });
  }
  const token = signToken({ role: "admin" });
  return res.json({ success: true, token });
});

// GET /api/admin/verify — validate an admin JWT
app.get("/api/admin/verify", requireAdmin, (req, res) => {
  res.json({ valid: true });
});

// ── Application endpoints ────────────────────────────────────────────────────

// POST /api/applications — save a new membership application (public)
app.post("/api/applications", async (req, res) => {
  const { goals, personal, address, account, credentials, referenceNumber } = req.body;

  if (!personal || !address || !account || !referenceNumber) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const loginId = credentials?.loginId || null;
  const passwordHash = credentials?.password ? hashPassword(credentials.password) : null;

  try {
    const result = await pool.query(
      `INSERT INTO membership_applications
         (reference_number, goals, first_name, last_name, email, phone,
          date_of_birth, ssn_last4, street, apt, city, state, zip,
          account_type, login_id, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING id, reference_number, submitted_at`,
      [
        referenceNumber,
        Array.isArray(goals) ? goals : null,
        personal.firstName,
        personal.lastName,
        personal.email,
        personal.phone,
        personal.dob,
        personal.ssn,
        address.street,
        address.apt || null,
        address.city,
        address.state,
        address.zip,
        account,
        loginId,
        passwordHash,
      ]
    );

    return res.status(201).json({ success: true, application: result.rows[0] });
  } catch (err) {
    console.error("Error saving application:", err);
    if (err.code === "23505") {
      if (err.constraint && err.constraint.includes("login_id")) {
        return res.status(409).json({ error: "That Login ID is already taken. Please choose another." });
      }
      return res.status(409).json({ error: "Duplicate reference number" });
    }
    return res.status(500).json({ error: "Failed to save application" });
  }
});

// PUT /api/applications/:id — update any field (admin only)
app.put("/api/applications/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const {
    firstName, lastName, email, phone, dob, ssnLast4,
    street, apt, city, state, zip, accountType, loginId, status,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE membership_applications SET
         first_name    = COALESCE($1,  first_name),
         last_name     = COALESCE($2,  last_name),
         email         = COALESCE($3,  email),
         phone         = COALESCE($4,  phone),
         date_of_birth = COALESCE($5,  date_of_birth),
         ssn_last4     = COALESCE($6,  ssn_last4),
         street        = COALESCE($7,  street),
         apt           = $8,
         city          = COALESCE($9,  city),
         state         = COALESCE($10, state),
         zip           = COALESCE($11, zip),
         account_type  = COALESCE($12, account_type),
         login_id      = COALESCE($13, login_id),
         status        = COALESCE($14, status)
       WHERE id = $15
       RETURNING *`,
      [
        firstName || null, lastName || null, email || null, phone || null,
        dob || null, ssnLast4 || null, street || null,
        apt !== undefined ? (apt || null) : undefined,
        city || null, state || null, zip || null,
        accountType || null, loginId || null, status || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }
    return res.json({ success: true, application: result.rows[0] });
  } catch (err) {
    console.error("Error updating application:", err);
    if (err.code === "23505") {
      return res.status(409).json({ error: "That Login ID is already taken by another member." });
    }
    return res.status(500).json({ error: "Failed to update application" });
  }
});

// GET /api/applications — list all applications (admin only)
app.get("/api/applications", requireAdmin, async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, reference_number, first_name, last_name, email, phone,
              date_of_birth, ssn_last4, street, apt, city, state, zip,
              account_type, login_id, status, submitted_at
       FROM membership_applications
       ORDER BY submitted_at DESC
       LIMIT 200`
    );
    return res.json({ applications: result.rows });
  } catch (err) {
    console.error("Error fetching applications:", err);
    return res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// GET /api/applications/:ref — fetch single application by reference number (admin only)
app.get("/api/applications/:ref", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, reference_number, first_name, last_name, email, phone,
              street, apt, city, state, zip, date_of_birth, ssn_last4,
              account_type, login_id, status, submitted_at
       FROM membership_applications WHERE reference_number = $1`,
      [req.params.ref]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }
    return res.json({ application: result.rows[0] });
  } catch (err) {
    console.error("Error fetching application:", err);
    return res.status(500).json({ error: "Failed to fetch application" });
  }
});

// GET /api/session/repair?ref=xxx — re-hydrate session with loginId (public — called right after login)
app.get("/api/session/repair", async (req, res) => {
  const { ref } = req.query;
  if (!ref) return res.status(400).json({ error: "ref required" });
  try {
    const result = await pool.query(
      "SELECT login_id, first_name, last_name, email, account_type, reference_number FROM membership_applications WHERE reference_number = $1",
      [ref]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Not found" });
    const m = result.rows[0];
    return res.json({
      loginId: m.login_id,
      firstName: m.first_name,
      lastName: m.last_name,
      email: m.email,
      accountType: m.account_type,
      referenceNumber: m.reference_number,
    });
  } catch {
    return res.status(500).json({ error: "Repair failed" });
  }
});

// ── Member account endpoints (require member JWT) ────────────────────────────

// GET /api/member/:loginId/account
app.get("/api/member/:loginId/account", requireAuth, async (req, res) => {
  const { loginId } = req.params;

  if (req.user.loginId !== loginId) {
    return res.status(403).json({ error: "Access denied." });
  }

  try {
    let balRes = await pool.query("SELECT * FROM member_balances WHERE login_id = $1", [loginId]);
    let balance = balRes.rows[0];
    if (!balance) {
      const ins = await pool.query(
        "INSERT INTO member_balances (login_id) VALUES ($1) RETURNING *", [loginId]
      );
      balance = ins.rows[0];
    }
    const txRes = await pool.query(
      "SELECT * FROM member_transactions WHERE login_id = $1 ORDER BY created_at DESC LIMIT 50", [loginId]
    );
    const alertRes = await pool.query(
      "SELECT * FROM member_alerts WHERE login_id = $1 ORDER BY created_at DESC", [loginId]
    );
    return res.json({
      balance: { available: parseFloat(balance.available_balance), current: parseFloat(balance.current_balance) },
      transactions: txRes.rows,
      alerts: alertRes.rows,
    });
  } catch (err) {
    console.error("Error fetching account data:", err);
    return res.status(500).json({ error: "Failed to fetch account data" });
  }
});

// PUT /api/member/:loginId/balance (admin only)
app.put("/api/member/:loginId/balance", requireAdmin, async (req, res) => {
  const { loginId } = req.params;
  const { available, current } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO member_balances (login_id, available_balance, current_balance, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (login_id) DO UPDATE SET
         available_balance = $2, current_balance = $3, updated_at = NOW()
       RETURNING *`,
      [loginId, available, current]
    );
    return res.json({ success: true, balance: result.rows[0] });
  } catch (err) {
    console.error("Error updating balance:", err);
    return res.status(500).json({ error: "Failed to update balance" });
  }
});

// GET /api/member/:loginId/account-admin (admin read of member data)
app.get("/api/member/:loginId/account-admin", requireAdmin, async (req, res) => {
  const { loginId } = req.params;
  try {
    let balRes = await pool.query("SELECT * FROM member_balances WHERE login_id = $1", [loginId]);
    let balance = balRes.rows[0];
    if (!balance) {
      const ins = await pool.query(
        "INSERT INTO member_balances (login_id) VALUES ($1) RETURNING *", [loginId]
      );
      balance = ins.rows[0];
    }
    const txRes = await pool.query(
      "SELECT * FROM member_transactions WHERE login_id = $1 ORDER BY created_at DESC LIMIT 50", [loginId]
    );
    const alertRes = await pool.query(
      "SELECT * FROM member_alerts WHERE login_id = $1 ORDER BY created_at DESC", [loginId]
    );
    return res.json({
      balance: { available: parseFloat(balance.available_balance), current: parseFloat(balance.current_balance) },
      transactions: txRes.rows,
      alerts: alertRes.rows,
    });
  } catch (err) {
    console.error("Error fetching account data:", err);
    return res.status(500).json({ error: "Failed to fetch account data" });
  }
});

// POST /api/member/:loginId/transactions (admin only)
app.post("/api/member/:loginId/transactions", requireAdmin, async (req, res) => {
  const { loginId } = req.params;
  const { txn_date, description, category, amount, txn_type } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO member_transactions (login_id, txn_date, description, category, amount, txn_type)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [loginId, txn_date, description, category || "Other", amount, txn_type || "debit"]
    );
    return res.status(201).json({ success: true, transaction: result.rows[0] });
  } catch (err) {
    console.error("Error adding transaction:", err);
    return res.status(500).json({ error: "Failed to add transaction" });
  }
});

// PUT /api/member/:loginId/transactions/:id (admin only)
app.put("/api/member/:loginId/transactions/:id", requireAdmin, async (req, res) => {
  const { loginId, id } = req.params;
  const { txn_date, description, category, amount, txn_type } = req.body;
  try {
    const result = await pool.query(
      `UPDATE member_transactions SET
         txn_date    = COALESCE($1, txn_date),
         description = COALESCE($2, description),
         category    = COALESCE($3, category),
         amount      = COALESCE($4, amount),
         txn_type    = COALESCE($5, txn_type)
       WHERE id = $6 AND login_id = $7
       RETURNING *`,
      [txn_date || null, description || null, category || null,
       amount != null ? parseFloat(amount) : null, txn_type || null, id, loginId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Transaction not found" });
    return res.json({ success: true, transaction: result.rows[0] });
  } catch (err) {
    console.error("Error updating transaction:", err);
    return res.status(500).json({ error: "Failed to update transaction" });
  }
});

// DELETE /api/member/:loginId/transactions/:id (admin only)
app.delete("/api/member/:loginId/transactions/:id", requireAdmin, async (req, res) => {
  const { loginId, id } = req.params;
  try {
    await pool.query("DELETE FROM member_transactions WHERE id = $1 AND login_id = $2", [id, loginId]);
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: "Failed to delete transaction" });
  }
});

// POST /api/member/:loginId/alerts (admin only)
app.post("/api/member/:loginId/alerts", requireAdmin, async (req, res) => {
  const { loginId } = req.params;
  const { title, message, alert_type } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO member_alerts (login_id, title, message, alert_type) VALUES ($1, $2, $3, $4) RETURNING *`,
      [loginId, title, message, alert_type || "info"]
    );
    return res.status(201).json({ success: true, alert: result.rows[0] });
  } catch {
    return res.status(500).json({ error: "Failed to add alert" });
  }
});

// PUT /api/member/:loginId/alerts/:id (admin only)
app.put("/api/member/:loginId/alerts/:id", requireAdmin, async (req, res) => {
  const { loginId, id } = req.params;
  const { title, message, alert_type } = req.body;
  try {
    const result = await pool.query(
      `UPDATE member_alerts SET
         title      = COALESCE($1, title),
         message    = COALESCE($2, message),
         alert_type = COALESCE($3, alert_type)
       WHERE id = $4 AND login_id = $5
       RETURNING *`,
      [title || null, message || null, alert_type || null, id, loginId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Alert not found" });
    return res.json({ success: true, alert: result.rows[0] });
  } catch (err) {
    console.error("Error updating alert:", err);
    return res.status(500).json({ error: "Failed to update alert" });
  }
});

// DELETE /api/member/:loginId/alerts/:id (admin only)
app.delete("/api/member/:loginId/alerts/:id", requireAdmin, async (req, res) => {
  const { loginId, id } = req.params;
  try {
    await pool.query("DELETE FROM member_alerts WHERE id = $1 AND login_id = $2", [id, loginId]);
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: "Failed to delete alert" });
  }
});

// ── Contact form ─────────────────────────────────────────────────────────────

// POST /api/contact — send contact form email
app.post("/api/contact", async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  const submittedAt = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "full",
    timeStyle: "long",
  });

  const transporter = createTransporter();

  if (!transporter) {
    console.warn("SMTP not configured — contact form submission logged only.");
    console.log(`Contact form: ${firstName} ${lastName} <${email}> — ${subject || "(no subject)"} — ${message}`);
    return res.json({ success: true });
  }

  const htmlBody = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;padding:32px;border-radius:4px">
      <div style="background:#2b6e44;color:#fff;padding:16px 20px;margin:-32px -32px 24px;border-radius:4px 4px 0 0">
        <h2 style="margin:0;font-size:18px">New Contact Form Submission</h2>
        <p style="margin:4px 0 0;font-size:13px;opacity:.7">A+ Federal Credit Union — Contact Us</p>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:8px 0;color:#6b7280;width:130px">Name</td><td style="padding:8px 0;font-weight:600">${firstName} ${lastName}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#2b6e44">${email}</a></td></tr>
        <tr><td style="padding:8px 0;color:#6b7280">Subject</td><td style="padding:8px 0">${subject || "(no subject)"}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;vertical-align:top">Message</td><td style="padding:8px 0;white-space:pre-wrap">${message}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280">Submitted</td><td style="padding:8px 0;font-size:12px;color:#9ca3af">${submittedAt}</td></tr>
      </table>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: "liwats48@gmail.com",
      replyTo: `"${firstName} ${lastName}" <${email}>`,
      subject: `[A+FCU Contact] ${subject || "New message from " + firstName + " " + lastName}`,
      html: htmlBody,
      text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nSubject: ${subject || "(none)"}\nMessage:\n${message}\n\nSubmitted: ${submittedAt}`,
    });
    return res.json({ success: true });
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({ error: "Failed to send message. Please try again or call us directly." });
  }
});

// ── Static frontend (production) ─────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const distPath = join(__dirname, "../dist");

if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("/{*path}", (req, res) => {
    res.sendFile(join(distPath, "index.html"));
  });
}

// ── Start ────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || process.env.API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
