const express = require("express");
const pool = require("../db");
const requireAuth = require("../middleware/auth");

const router = express.Router();

function shapeJob(row) {
  return {
    id: row.id,
    title: row.title,
    company: row.company,
    location: row.location,
    type: row.employment_type,
    tag: row.category,
    saved: row.saved,
  };
}

router.get("/", requireAuth, async (req, res) => {
  const search = req.query.q ? `%${req.query.q}%` : "%";
  const result = await pool.query(
    `SELECT j.*, (sj.user_id IS NOT NULL) AS saved
     FROM jobs j LEFT JOIN saved_jobs sj ON sj.job_id = j.id AND sj.user_id = $1
     WHERE j.title ILIKE $2 OR j.company ILIKE $2 OR j.category ILIKE $2
     ORDER BY j.created_at DESC`,
    [req.userId, search]
  );
  res.json(result.rows.map(shapeJob));
});

router.post("/:id/save", requireAuth, async (req, res) => {
  const jobId = Number(req.params.id);
  const existing = await pool.query("SELECT 1 FROM saved_jobs WHERE user_id = $1 AND job_id = $2", [req.userId, jobId]);
  if (existing.rows[0]) {
    await pool.query("DELETE FROM saved_jobs WHERE user_id = $1 AND job_id = $2", [req.userId, jobId]);
    return res.json({ saved: false });
  }
  await pool.query("INSERT INTO saved_jobs (user_id, job_id) VALUES ($1, $2)", [req.userId, jobId]);
  res.json({ saved: true });
});

module.exports = router;
