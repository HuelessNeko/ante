import { Router } from "express";
import { pool } from "../db/pool.js";

const router = Router();

// GET /api/users
router.get("/", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM users ORDER BY created_at DESC",
  );
  res.json(rows);
});

// GET /api/users/:id
router.get("/:id", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
    req.params.id,
  ]);
  if (!rows[0]) return res.status(404).json({ error: "User not found" });
  res.json(rows[0]);
});

// POST /api/users
router.post("/", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email)
    return res.status(400).json({ error: "name and email are required" });

  const { rows } = await pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email],
  );
  res.status(201).json(rows[0]);
});

// DELETE /api/users/:id
router.delete("/:id", async (req, res) => {
  const { rows } = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    [req.params.id],
  );
  if (!rows[0]) return res.status(404).json({ error: "User not found" });
  res.json({ message: "User deleted", user: rows[0] });
});

export default router;
