const express = require("express");
const pool = require("../db");
const requireAuth = require("../middleware/auth");

const router = express.Router();

function publicUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    headline: row.headline,
    bio: row.bio,
    avatarUrl: row.avatar_url,
  };
}

// Current logged-in user
router.get("/me", requireAuth, async (req, res) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [req.userId]);
  if (!result.rows[0]) return res.status(404).json({ error: "User not found" });
  res.json(publicUser(result.rows[0]));
});

// Update current user's profile
router.put("/me", requireAuth, async (req, res) => {
  const { name, headline, bio, avatarUrl } = req.body;
  const result = await pool.query(
    `UPDATE users SET
       name = COALESCE($1, name),
       headline = COALESCE($2, headline),
       bio = COALESCE($3, bio),
       avatar_url = COALESCE($4, avatar_url)
     WHERE id = $5
     RETURNING *`,
    [name, headline, bio, avatarUrl, req.userId]
  );
  res.json(publicUser(result.rows[0]));
});

// View any user's public profile
router.get("/:id", async (req, res) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
  if (!result.rows[0]) return res.status(404).json({ error: "User not found" });
  res.json(publicUser(result.rows[0]));
});

// Simple directory / search by name
router.get("/", async (req, res) => {
  const q = req.query.q ? `%${req.query.q}%` : "%";
  const result = await pool.query(
    "SELECT * FROM users WHERE name ILIKE $1 ORDER BY name LIMIT 20",
    [q]
  );
  res.json(result.rows.map(publicUser));
});

module.exports = router;
