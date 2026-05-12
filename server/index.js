import express from "express";
import cors from "cors";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
app.use(cors());
app.use(express.json());

// POST /api/applications — save a new membership application
app.post("/api/applications", async (req, res) => {
  const { goals, personal, address, account, referenceNumber } = req.body;

  if (!personal || !address || !account || !referenceNumber) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO membership_applications
         (reference_number, goals, first_name, last_name, email, phone,
          date_of_birth, ssn_last4, street, apt, city, state, zip, account_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING id, reference_number, submitted_at`,
      [
        referenceNumber,
        goals,
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
      ]
    );

    return res.status(201).json({ success: true, application: result.rows[0] });
  } catch (err) {
    console.error("Error saving application:", err);
    if (err.code === "23505") {
      return res.status(409).json({ error: "Duplicate reference number" });
    }
    return res.status(500).json({ error: "Failed to save application" });
  }
});

// GET /api/applications — list all applications (admin use)
app.get("/api/applications", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, reference_number, first_name, last_name, email, phone,
              city, state, account_type, status, submitted_at
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
      `SELECT * FROM membership_applications WHERE reference_number = $1`,
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
