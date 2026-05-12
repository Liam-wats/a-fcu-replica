import express from "express";
import cors from "cors";
import pg from "pg";
import crypto from "crypto";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

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

  // Add login columns to existing table if they don't exist
  await pool.query(`
    ALTER TABLE membership_applications
      ADD COLUMN IF NOT EXISTS login_id TEXT UNIQUE,
      ADD COLUMN IF NOT EXISTS password_hash TEXT
  `);
}

migrate().catch(console.error);

function hashPassword(password) {
  return crypto.createHash("sha256").update(password + "apfcu_salt").digest("hex");
}

const app = express();
app.use(cors());
app.use(express.json());

// POST /api/applications — save a new membership application
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
        goals ? JSON.stringify(goals) : null,
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
      // Check if it's a login_id conflict
      if (err.constraint && err.constraint.includes("login_id")) {
        return res.status(409).json({ error: "That Login ID is already taken. Please choose another." });
      }
      return res.status(409).json({ error: "Duplicate reference number" });
    }
    return res.status(500).json({ error: "Failed to save application" });
  }
});

// POST /api/login — authenticate a member
app.post("/api/login", async (req, res) => {
  const { loginId, password } = req.body;

  if (!loginId || !password) {
    return res.status(400).json({ error: "Login ID and password are required." });
  }

  const hash = hashPassword(password);

  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, account_type, status, reference_number
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

    return res.json({
      success: true,
      member: {
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

// GET /api/applications — list all applications (admin use)
app.get("/api/applications", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, reference_number, first_name, last_name, email, phone,
              city, state, account_type, login_id, status, submitted_at
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

// GET /api/applications/:ref — fetch single application by reference number
app.get("/api/applications/:ref", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, reference_number, first_name, last_name, email, phone,
              street, apt, city, state, zip, account_type, login_id, status, submitted_at
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

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
