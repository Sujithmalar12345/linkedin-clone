const express = require("express");
const pool = require("../db");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const result = await pool.query(
    `SELECT n.id, n.type, n.message, n.read_at AS "readAt", n.created_at AS "createdAt",
            u.name AS actor_name, u.avatar_url AS actor_avatar_url
     FROM notifications n LEFT JOIN users u ON u.id = n.actor_id
     WHERE n.user_id = $1 ORDER BY n.created_at DESC LIMIT 50`,
    [req.userId]
  );
  res.json(result.rows.map((row) => ({ id: row.id, type: row.type, title: row.actor_name ? `${row.actor_name} ${row.message}` : row.message, detail: row.type === "message" ? "Open Messages to reply" : "Your professional network", time: row.createdAt, read: Boolean(row.readAt), avatarUrl: row.actor_avatar_url })));
});

router.put("/read", requireAuth, async (req, res) => {
  await pool.query("UPDATE notifications SET read_at = COALESCE(read_at, now()) WHERE user_id = $1", [req.userId]);
  res.status(204).end();
});

module.exports = router;
