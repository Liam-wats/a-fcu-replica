import express from "express";
import cors from "cors";
import pg from "pg";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import multer from "multer";
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
      ADD COLUMN IF NOT EXISTS password_hash TEXT,
      ADD COLUMN IF NOT EXISTS membership_year INTEGER
  `);
}

migrate().catch((err) => console.warn("DB migrate skipped:", err.message));

async function migrateCheckDeposits() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS check_deposits (
      id SERIAL PRIMARY KEY,
      login_id TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      front_image BYTEA NOT NULL,
      front_mime TEXT NOT NULL,
      back_image BYTEA NOT NULL,
      back_mime TEXT NOT NULL,
      status TEXT DEFAULT 'submitted',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}
migrateCheckDeposits().catch((err) => console.warn("DB migrateCheckDeposits skipped:", err.message));

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

async function migrateChat() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS chat_conversations (
      id SERIAL PRIMARY KEY,
      login_id TEXT NOT NULL,
      member_name TEXT NOT NULL,
      status TEXT DEFAULT 'open',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id SERIAL PRIMARY KEY,
      conversation_id INTEGER NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
      sender_type TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}
migrateChat().catch((err) => console.warn("DB migrateChat skipped:", err.message));

async function migrateLinkedAccounts() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS member_linked_accounts (
      id SERIAL PRIMARY KEY,
      login_id TEXT UNIQUE NOT NULL,
      bank_name TEXT NOT NULL,
      account_number TEXT NOT NULL,
      routing_number TEXT NOT NULL,
      account_type TEXT NOT NULL DEFAULT 'Checking',
      nickname TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}
migrateLinkedAccounts().catch((err) => console.warn("DB migrateLinkedAccounts skipped:", err.message));

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

// ── Multer (memory storage — images stored in DB) ────────────────────────────

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed."));
  },
});

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
    street, apt, city, state, zip, accountType, loginId, membershipYear, status, submittedAt,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE membership_applications SET
         first_name      = COALESCE($1,  first_name),
         last_name       = COALESCE($2,  last_name),
         email           = COALESCE($3,  email),
         phone           = COALESCE($4,  phone),
         date_of_birth   = COALESCE($5,  date_of_birth),
         ssn_last4       = COALESCE($6,  ssn_last4),
         street          = COALESCE($7,  street),
         apt             = $8,
         city            = COALESCE($9,  city),
         state           = COALESCE($10, state),
         zip             = COALESCE($11, zip),
         account_type    = COALESCE($12, account_type),
         login_id        = COALESCE($13, login_id),
         status          = COALESCE($14, status),
         submitted_at    = COALESCE($16, submitted_at),
         membership_year = $17
       WHERE id = $15
       RETURNING *`,
      [
        firstName || null, lastName || null, email || null, phone || null,
        dob || null, ssnLast4 || null, street || null,
        apt !== undefined ? (apt || null) : undefined,
        city || null, state || null, zip || null,
        accountType || null, loginId || null, status || null,
        id,
        submittedAt ? new Date(submittedAt).toISOString() : null,
        membershipYear != null ? parseInt(membershipYear, 10) : null,
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
              account_type, login_id, membership_year, status, submitted_at
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

// DELETE /api/applications/:id — permanently delete an application (admin only)
app.delete("/api/applications/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM membership_applications WHERE id = $1 RETURNING id",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }
    return res.json({ success: true });
  } catch (err) {
    console.error("Error deleting application:", err);
    return res.status(500).json({ error: "Failed to delete application" });
  }
});

// GET /api/applications/:ref — fetch single application by reference number (admin only)
app.get("/api/applications/:ref", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, reference_number, first_name, last_name, email, phone,
              street, apt, city, state, zip, date_of_birth, ssn_last4,
              account_type, login_id, membership_year, status, submitted_at
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

// GET /api/member/:loginId/profile — fetch member contact info
app.get("/api/member/:loginId/profile", requireAuth, async (req, res) => {
  const { loginId } = req.params;
  if (req.user.loginId !== loginId) return res.status(403).json({ error: "Access denied." });
  try {
    const result = await pool.query(
      `SELECT first_name, last_name, email, phone, street, apt, city, state, zip, account_type, reference_number
       FROM membership_applications WHERE login_id = $1`,
      [loginId]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Member not found." });
    const m = result.rows[0];
    return res.json({
      firstName: m.first_name,
      lastName: m.last_name,
      email: m.email,
      phone: m.phone,
      street: m.street,
      apt: m.apt,
      city: m.city,
      state: m.state,
      zip: m.zip,
      accountType: m.account_type,
      referenceNumber: m.reference_number,
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    return res.status(500).json({ error: "Failed to fetch profile." });
  }
});

// PUT /api/member/:loginId/profile — update contact info
app.put("/api/member/:loginId/profile", requireAuth, async (req, res) => {
  const { loginId } = req.params;
  if (req.user.loginId !== loginId) return res.status(403).json({ error: "Access denied." });
  const { firstName, lastName, email, phone, street, apt, city, state, zip } = req.body;
  if (!firstName || !lastName || !email || !phone) {
    return res.status(400).json({ error: "First name, last name, email, and phone are required." });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return res.status(400).json({ error: "Please enter a valid email address." });
  try {
    const result = await pool.query(
      `UPDATE membership_applications SET
         first_name = $1, last_name = $2, email = $3, phone = $4,
         street = COALESCE($5, street), apt = $6,
         city = COALESCE($7, city), state = COALESCE($8, state), zip = COALESCE($9, zip)
       WHERE login_id = $10
       RETURNING first_name, last_name, email, phone, street, apt, city, state, zip`,
      [firstName, lastName, email, phone, street || null, apt || null, city || null, state || null, zip || null, loginId]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Member not found." });
    const m = result.rows[0];
    return res.json({
      success: true,
      profile: {
        firstName: m.first_name, lastName: m.last_name,
        email: m.email, phone: m.phone,
        street: m.street, apt: m.apt, city: m.city, state: m.state, zip: m.zip,
      },
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({ error: "Failed to update profile." });
  }
});

// PUT /api/member/:loginId/password — change password
app.put("/api/member/:loginId/password", requireAuth, async (req, res) => {
  const { loginId } = req.params;
  if (req.user.loginId !== loginId) return res.status(403).json({ error: "Access denied." });
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: "Current and new password are required." });
  if (newPassword.length < 8) return res.status(400).json({ error: "New password must be at least 8 characters." });
  try {
    const currentHash = hashPassword(currentPassword);
    const check = await pool.query(
      "SELECT id FROM membership_applications WHERE login_id = $1 AND password_hash = $2",
      [loginId, currentHash]
    );
    if (check.rows.length === 0) return res.status(401).json({ error: "Current password is incorrect." });
    const newHash = hashPassword(newPassword);
    await pool.query(
      "UPDATE membership_applications SET password_hash = $1 WHERE login_id = $2",
      [newHash, loginId]
    );
    return res.json({ success: true });
  } catch (err) {
    console.error("Error changing password:", err);
    return res.status(500).json({ error: "Failed to change password." });
  }
});

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
      "SELECT * FROM member_transactions WHERE login_id = $1 ORDER BY txn_date DESC, created_at DESC LIMIT 200", [loginId]
    );
    const alertRes = await pool.query(
      "SELECT * FROM member_alerts WHERE login_id = $1 ORDER BY created_at DESC", [loginId]
    );
    const appRes = await pool.query(
      "SELECT membership_year FROM membership_applications WHERE login_id = $1 LIMIT 1", [loginId]
    );
    const membershipYear = appRes.rows[0]?.membership_year ?? null;
    return res.json({
      balance: { available: parseFloat(balance.available_balance), current: parseFloat(balance.current_balance) },
      transactions: txRes.rows,
      alerts: alertRes.rows,
      membershipYear,
    });
  } catch (err) {
    console.error("Error fetching account data:", err);
    return res.status(500).json({ error: "Failed to fetch account data" });
  }
});

// ── Linked External Account endpoints ────────────────────────────────────────

// POST /api/member/:loginId/deposit — submit a mobile check deposit with images
app.post("/api/member/:loginId/deposit", requireAuth, upload.fields([{ name: "front", maxCount: 1 }, { name: "back", maxCount: 1 }]), async (req, res) => {
  const { loginId } = req.params;
  if (req.user.loginId !== loginId) return res.status(403).json({ error: "Access denied." });

  const files = req.files;
  const frontFile = files?.front?.[0];
  const backFile  = files?.back?.[0];

  if (!frontFile || !backFile) {
    return res.status(400).json({ error: "Both front and back check images are required." });
  }

  const amount = parseFloat(req.body.amount);
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid deposit amount." });
  }
  if (amount > 5000) {
    return res.status(400).json({ error: "Amount exceeds the $5,000 daily mobile deposit limit." });
  }

  const today = new Date().toISOString().slice(0, 10);

  try {
    await pool.query(
      `INSERT INTO check_deposits (login_id, amount, front_image, front_mime, back_image, back_mime)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [loginId, amount, frontFile.buffer, frontFile.mimetype, backFile.buffer, backFile.mimetype]
    );

    const balRes = await pool.query("SELECT available_balance, current_balance FROM member_balances WHERE login_id = $1", [loginId]);
    const cur = balRes.rows[0] ?? { available_balance: 0, current_balance: 0 };
    const newAvail   = parseFloat(cur.available_balance)   + amount;
    const newCurrent = parseFloat(cur.current_balance) + amount;

    await pool.query(
      `INSERT INTO member_balances (login_id, available_balance, current_balance, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (login_id) DO UPDATE
       SET available_balance = $2, current_balance = $3, updated_at = NOW()`,
      [loginId, newAvail, newCurrent]
    );

    const txnDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const txRes = await pool.query(
      `INSERT INTO member_transactions (login_id, txn_date, description, category, amount, txn_type)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [loginId, txnDate, "Mobile Check Deposit", "Deposit", amount, "credit"]
    );

    return res.status(201).json({
      success: true,
      transaction: txRes.rows[0],
      newBalance: { available: newAvail, current: newCurrent },
    });
  } catch (err) {
    console.error("Deposit error:", err);
    return res.status(500).json({ error: "Failed to process deposit. Please try again." });
  }
});

// GET /api/member/:loginId/deposits — list past check deposits
app.get("/api/member/:loginId/deposits", requireAuth, async (req, res) => {
  const { loginId } = req.params;
  if (req.user.loginId !== loginId) return res.status(403).json({ error: "Access denied." });
  try {
    const result = await pool.query(
      `SELECT id, amount, status, created_at FROM check_deposits
       WHERE login_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [loginId]
    );
    return res.json({ deposits: result.rows });
  } catch (err) {
    console.error("Deposits list error:", err);
    return res.status(500).json({ error: "Failed to fetch deposit history." });
  }
});

// GET /api/member/:loginId/deposits/:id/image/:side — serve check image
app.get("/api/member/:loginId/deposits/:id/image/:side", requireAuth, async (req, res) => {
  const { loginId, id, side } = req.params;
  if (req.user.loginId !== loginId) return res.status(403).json({ error: "Access denied." });
  if (!["front", "back"].includes(side)) return res.status(400).json({ error: "Invalid side." });
  try {
    const col = side === "front" ? "front_image, front_mime" : "back_image, back_mime";
    const result = await pool.query(
      `SELECT ${col} FROM check_deposits WHERE id = $1 AND login_id = $2`,
      [id, loginId]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Not found." });
    const row = result.rows[0];
    const image = side === "front" ? row.front_image : row.back_image;
    const mime  = side === "front" ? row.front_mime  : row.back_mime;
    res.set("Content-Type", mime);
    res.set("Cache-Control", "private, max-age=3600");
    return res.send(image);
  } catch (err) {
    console.error("Deposit image error:", err);
    return res.status(500).json({ error: "Failed to load image." });
  }
});

// GET /api/member/:loginId/linked-account
app.get("/api/member/:loginId/linked-account", requireAuth, async (req, res) => {
  const { loginId } = req.params;
  if (req.user.loginId !== loginId) return res.status(403).json({ error: "Access denied." });
  try {
    const result = await pool.query(
      "SELECT * FROM member_linked_accounts WHERE login_id = $1",
      [loginId]
    );
    return res.json({ account: result.rows[0] || null });
  } catch (err) {
    console.error("Error fetching linked account:", err);
    return res.status(500).json({ error: "Failed to fetch linked account" });
  }
});

// POST /api/member/:loginId/linked-account — create or replace
app.post("/api/member/:loginId/linked-account", requireAuth, async (req, res) => {
  const { loginId } = req.params;
  if (req.user.loginId !== loginId) return res.status(403).json({ error: "Access denied." });
  const { bankName, accountNumber, routingNumber, accountType, nickname } = req.body;
  if (!bankName || !accountNumber || !routingNumber || !accountType) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (!/^\d{9}$/.test(routingNumber)) {
    return res.status(400).json({ error: "Routing number must be exactly 9 digits." });
  }
  if (!/^\d{4,17}$/.test(accountNumber)) {
    return res.status(400).json({ error: "Account number must be 4–17 digits." });
  }
  try {
    const result = await pool.query(
      `INSERT INTO member_linked_accounts
         (login_id, bank_name, account_number, routing_number, account_type, nickname, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (login_id) DO UPDATE SET
         bank_name = EXCLUDED.bank_name,
         account_number = EXCLUDED.account_number,
         routing_number = EXCLUDED.routing_number,
         account_type = EXCLUDED.account_type,
         nickname = EXCLUDED.nickname,
         updated_at = NOW()
       RETURNING *`,
      [loginId, bankName, accountNumber, routingNumber, accountType, nickname || null]
    );
    return res.json({ account: result.rows[0] });
  } catch (err) {
    console.error("Error saving linked account:", err);
    return res.status(500).json({ error: "Failed to save linked account" });
  }
});

// DELETE /api/member/:loginId/linked-account
app.delete("/api/member/:loginId/linked-account", requireAuth, async (req, res) => {
  const { loginId } = req.params;
  if (req.user.loginId !== loginId) return res.status(403).json({ error: "Access denied." });
  try {
    await pool.query("DELETE FROM member_linked_accounts WHERE login_id = $1", [loginId]);
    return res.json({ success: true });
  } catch (err) {
    console.error("Error deleting linked account:", err);
    return res.status(500).json({ error: "Failed to remove linked account" });
  }
});

// Helper: recompute balance from all transactions and persist it
async function recalcBalance(loginId) {
  const txRes = await pool.query(
    `SELECT COALESCE(
       SUM(CASE WHEN txn_type = 'credit' THEN amount ELSE -amount END), 0
     ) AS net
     FROM member_transactions WHERE login_id = $1`,
    [loginId]
  );
  const net = parseFloat(txRes.rows[0].net) || 0;
  await pool.query(
    `INSERT INTO member_balances (login_id, available_balance, current_balance, updated_at)
     VALUES ($1, $2, $2, NOW())
     ON CONFLICT (login_id) DO UPDATE SET
       available_balance = $2, current_balance = $2, updated_at = NOW()`,
    [loginId, net.toFixed(2)]
  );
  return net;
}

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
    const newBalance = await recalcBalance(loginId);
    return res.status(201).json({
      success: true,
      transaction: result.rows[0],
      newBalance: { available: newBalance, current: newBalance },
    });
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
    const newBalance = await recalcBalance(loginId);
    return res.json({
      success: true,
      transaction: result.rows[0],
      newBalance: { available: newBalance, current: newBalance },
    });
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
    const newBalance = await recalcBalance(loginId);
    return res.json({
      success: true,
      newBalance: { available: newBalance, current: newBalance },
    });
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

// ── Chat endpoints ────────────────────────────────────────────────────────────

// PUT /api/chat/conversations/:id/close — member closes their own conversation
app.put("/api/chat/conversations/:id/close", requireAuth, async (req, res) => {
  const { loginId } = req.user;
  const { id } = req.params;
  try {
    const convRes = await pool.query(
      "SELECT * FROM chat_conversations WHERE id = $1 AND login_id = $2",
      [id, loginId]
    );
    if (convRes.rows.length === 0) return res.status(403).json({ error: "Access denied" });
    await pool.query(
      "UPDATE chat_conversations SET status = 'closed', updated_at = NOW() WHERE id = $1",
      [id]
    );
    return res.json({ success: true });
  } catch (err) {
    console.error("Chat close error:", err);
    return res.status(500).json({ error: "Failed to close conversation" });
  }
});

// GET /api/chat/conversation — member's most recent conversation + messages
app.get("/api/chat/conversation", requireAuth, async (req, res) => {
  const { loginId } = req.user;
  try {
    const convRes = await pool.query(
      "SELECT * FROM chat_conversations WHERE login_id = $1 ORDER BY created_at DESC LIMIT 1",
      [loginId]
    );
    if (convRes.rows.length === 0) return res.json({ conversation: null, messages: [] });
    const conv = convRes.rows[0];
    const msgRes = await pool.query(
      "SELECT * FROM chat_messages WHERE conversation_id = $1 ORDER BY created_at ASC",
      [conv.id]
    );
    return res.json({ conversation: conv, messages: msgRes.rows });
  } catch (err) {
    console.error("Chat fetch error:", err);
    return res.status(500).json({ error: "Failed to fetch conversation" });
  }
});

// POST /api/chat/conversations — member starts a new conversation
app.post("/api/chat/conversations", requireAuth, async (req, res) => {
  const { loginId } = req.user;
  const { message, memberName } = req.body;
  if (!message) return res.status(400).json({ error: "Message required" });
  try {
    const convRes = await pool.query(
      "INSERT INTO chat_conversations (login_id, member_name) VALUES ($1, $2) RETURNING *",
      [loginId, memberName || loginId]
    );
    const conv = convRes.rows[0];
    const msgRes = await pool.query(
      "INSERT INTO chat_messages (conversation_id, sender_type, message) VALUES ($1, $2, $3) RETURNING *",
      [conv.id, "member", message]
    );
    await pool.query("UPDATE chat_conversations SET updated_at = NOW() WHERE id = $1", [conv.id]);
    return res.status(201).json({ conversation: conv, message: msgRes.rows[0] });
  } catch (err) {
    console.error("Chat create error:", err);
    return res.status(500).json({ error: "Failed to start conversation" });
  }
});

// POST /api/chat/conversations/:id/messages — member sends a message
app.post("/api/chat/conversations/:id/messages", requireAuth, async (req, res) => {
  const { loginId } = req.user;
  const { id } = req.params;
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message required" });
  try {
    const convRes = await pool.query(
      "SELECT * FROM chat_conversations WHERE id = $1 AND login_id = $2",
      [id, loginId]
    );
    if (convRes.rows.length === 0) return res.status(403).json({ error: "Access denied" });
    const msgRes = await pool.query(
      "INSERT INTO chat_messages (conversation_id, sender_type, message) VALUES ($1, $2, $3) RETURNING *",
      [id, "member", message]
    );
    await pool.query("UPDATE chat_conversations SET updated_at = NOW() WHERE id = $1", [id]);
    return res.status(201).json({ message: msgRes.rows[0] });
  } catch (err) {
    console.error("Chat member message error:", err);
    return res.status(500).json({ error: "Failed to send message" });
  }
});

// GET /api/admin/chat/conversations — list all conversations (admin)
app.get("/api/admin/chat/conversations", requireAdmin, async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*,
        (SELECT message FROM chat_messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_message,
        (SELECT sender_type FROM chat_messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_sender,
        (SELECT created_at FROM chat_messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_message_at
      FROM chat_conversations c
      ORDER BY c.updated_at DESC
    `);
    return res.json({ conversations: result.rows });
  } catch (err) {
    console.error("Admin chat list error:", err);
    return res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

// GET /api/admin/chat/unread-count — count of conversations awaiting admin reply
app.get("/api/admin/chat/unread-count", requireAdmin, async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT COUNT(*) AS count FROM chat_conversations c
      WHERE c.status = 'open'
        AND (
          SELECT sender_type FROM chat_messages
          WHERE conversation_id = c.id
          ORDER BY created_at DESC LIMIT 1
        ) = 'member'
    `);
    return res.json({ count: parseInt(result.rows[0].count, 10) });
  } catch (err) {
    console.error("Admin chat unread error:", err);
    return res.status(500).json({ error: "Failed to fetch unread count" });
  }
});

// GET /api/admin/chat/conversations/:id/messages — messages for a conversation (admin)
app.get("/api/admin/chat/conversations/:id/messages", requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const msgRes = await pool.query(
      "SELECT * FROM chat_messages WHERE conversation_id = $1 ORDER BY created_at ASC",
      [id]
    );
    return res.json({ messages: msgRes.rows });
  } catch (err) {
    console.error("Admin chat messages error:", err);
    return res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// POST /api/admin/chat/conversations/:id/messages — admin reply
app.post("/api/admin/chat/conversations/:id/messages", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message required" });
  try {
    const msgRes = await pool.query(
      "INSERT INTO chat_messages (conversation_id, sender_type, message) VALUES ($1, $2, $3) RETURNING *",
      [id, "admin", message]
    );
    await pool.query(
      "UPDATE chat_conversations SET updated_at = NOW(), status = 'open' WHERE id = $1",
      [id]
    );
    return res.status(201).json({ message: msgRes.rows[0] });
  } catch (err) {
    console.error("Admin chat reply error:", err);
    return res.status(500).json({ error: "Failed to send reply" });
  }
});

// PUT /api/admin/chat/conversations/:id/status — open or close a conversation (admin)
app.put("/api/admin/chat/conversations/:id/status", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!["open", "closed"].includes(status)) return res.status(400).json({ error: "Invalid status" });
  try {
    const result = await pool.query(
      "UPDATE chat_conversations SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [status, id]
    );
    return res.json({ conversation: result.rows[0] });
  } catch (err) {
    console.error("Admin chat status error:", err);
    return res.status(500).json({ error: "Failed to update status" });
  }
});

// ── Admin deposit endpoints ───────────────────────────────────────────────────

// GET /api/admin/deposits — list all deposits across all members
app.get("/api/admin/deposits", requireAdmin, async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT cd.id, cd.login_id, cd.amount, cd.status, cd.created_at,
             ma.first_name, ma.last_name, ma.email
      FROM check_deposits cd
      LEFT JOIN membership_applications ma ON ma.login_id = cd.login_id
      ORDER BY cd.created_at DESC
      LIMIT 200
    `);
    return res.json({ deposits: result.rows });
  } catch (err) {
    console.error("Admin deposits list error:", err);
    return res.status(500).json({ error: "Failed to fetch deposits." });
  }
});

// PUT /api/admin/deposits/:id/status — update deposit status
app.put("/api/admin/deposits/:id/status", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!["submitted", "approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status." });
  }
  try {
    const result = await pool.query(
      "UPDATE check_deposits SET status = $1 WHERE id = $2 RETURNING id, status",
      [status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Deposit not found." });
    return res.json({ success: true, deposit: result.rows[0] });
  } catch (err) {
    console.error("Admin deposit status error:", err);
    return res.status(500).json({ error: "Failed to update status." });
  }
});

// GET /api/admin/deposits/:id/image/:side — serve check image for admin
app.get("/api/admin/deposits/:id/image/:side", requireAdmin, async (req, res) => {
  const { id, side } = req.params;
  if (!["front", "back"].includes(side)) return res.status(400).json({ error: "Invalid side." });
  try {
    const col = side === "front" ? "front_image, front_mime" : "back_image, back_mime";
    const result = await pool.query(`SELECT ${col} FROM check_deposits WHERE id = $1`, [id]);
    if (!result.rows[0]) return res.status(404).json({ error: "Not found." });
    const row = result.rows[0];
    const image = side === "front" ? row.front_image : row.back_image;
    const mime  = side === "front" ? row.front_mime  : row.back_mime;
    res.set("Content-Type", mime);
    res.set("Cache-Control", "private, max-age=3600");
    return res.send(image);
  } catch (err) {
    console.error("Admin deposit image error:", err);
    return res.status(500).json({ error: "Failed to load image." });
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
