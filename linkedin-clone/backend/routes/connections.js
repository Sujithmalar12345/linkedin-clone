const express = require("express");
const pool = require("../db");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const result = await pool.query(
    "SELECT requester_id, addressee_id, status FROM connections WHERE requester_id = $1 OR addressee_id = $1",
    [req.userId]
  );
  res.json(result.rows);
});

router.post("/:userId", requireAuth, async (req, res) => {
  const addresseeId = Number(req.params.userId);
  if (!Number.isInteger(addresseeId) || addresseeId === req.userId) {
    return res.status(400).json({ error: "Invalid connection target" });
  }

  const target = await pool.query("SELECT id FROM users WHERE id = $1", [addresseeId]);
  if (!target.rows[0]) return res.status(404).json({ error: "User not found" });

  const result = await pool.query(
    `INSERT INTO connections (requester_id, addressee_id)
     VALUES ($1, $2)
     ON CONFLICT (requester_id, addressee_id) DO UPDATE SET status = connections.status
     RETURNING requester_id, addressee_id, status`,
    [req.userId, addresseeId]
  );
  await pool.query(
    `INSERT INTO notifications (user_id, actor_id, type, message)
     SELECT $1, $2, 'connection', 'sent you a connection request'
     WHERE NOT EXISTS (
       SELECT 1 FROM notifications WHERE user_id = $1 AND actor_id = $2 AND type = 'connection'
     )`,
    [addresseeId, req.userId]
  );
  res.status(201).json(result.rows[0]);
});

module.exports = router;
