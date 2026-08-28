const express = require("express");
const pool = require("../db");
const requireAuth = require("../middleware/auth");

const router = express.Router();
const userSelect = `SELECT u.id, u.name, u.headline, u.avatar_url AS "avatarUrl"`;

async function getConversation(userId, otherId) {
  const first = Math.min(userId, otherId);
  const second = Math.max(userId, otherId);
  const result = await pool.query(
    "SELECT id FROM conversations WHERE participant_one = $1 AND participant_two = $2",
    [first, second]
  );
  if (result.rows[0]) return result.rows[0].id;
  const created = await pool.query(
    "INSERT INTO conversations (participant_one, participant_two) VALUES ($1, $2) RETURNING id",
    [first, second]
  );
  return created.rows[0].id;
}

router.get("/threads", requireAuth, async (req, res) => {
  const result = await pool.query(
    `${userSelect}, c.id AS conversation_id, m.content AS message, m.created_at AS time
     FROM conversations c
     JOIN users u ON u.id = CASE WHEN c.participant_one = $1 THEN c.participant_two ELSE c.participant_one END
     LEFT JOIN LATERAL (SELECT content, created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) m ON true
     WHERE c.participant_one = $1 OR c.participant_two = $1
     ORDER BY m.created_at DESC NULLS LAST, c.created_at DESC`,
    [req.userId]
  );
  res.json(result.rows.map((row) => ({ id: row.conversation_id, userId: row.id, name: row.name, headline: row.headline, avatarUrl: row.avatarUrl, message: row.message || "Start a conversation", time: row.time })));
});

router.get("/:userId", requireAuth, async (req, res) => {
  const otherId = Number(req.params.userId);
  const conversationId = await getConversation(req.userId, otherId);
  const result = await pool.query(
    `SELECT m.id, m.content, m.created_at AS "createdAt", m.sender_id AS "senderId"
     FROM messages m WHERE m.conversation_id = $1 ORDER BY m.created_at ASC`,
    [conversationId]
  );
  res.json(result.rows);
});

router.post("/:userId", requireAuth, async (req, res) => {
  const otherId = Number(req.params.userId);
  const content = typeof req.body.content === "string" ? req.body.content.trim() : "";
  if (!Number.isInteger(otherId) || otherId === req.userId || !content) return res.status(400).json({ error: "A recipient and message are required" });
  const target = await pool.query("SELECT id FROM users WHERE id = $1", [otherId]);
  if (!target.rows[0]) return res.status(404).json({ error: "User not found" });
  const conversationId = await getConversation(req.userId, otherId);
  const result = await pool.query(
    `INSERT INTO messages (conversation_id, sender_id, content) VALUES ($1, $2, $3)
     RETURNING id, content, created_at AS "createdAt", sender_id AS "senderId"`,
    [conversationId, req.userId, content]
  );
  await pool.query(
    "INSERT INTO notifications (user_id, actor_id, type, message) VALUES ($1, $2, 'message', 'sent you a message')",
    [otherId, req.userId]
  );
  res.status(201).json(result.rows[0]);
});

module.exports = router;
