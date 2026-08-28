const express = require("express");
const pool = require("../db");
const requireAuth = require("../middleware/auth");

const router = express.Router();

function shapePost(row) {
  return {
    id: `company-${row.id}`,
    content: row.content,
    createdAt: row.created_at,
    likeCount: row.like_count,
    likedByMe: false,
    author: { id: `company-${row.company_id}`, name: row.company_name, headline: row.company_tagline, avatarUrl: row.logo_url },
  };
}

async function getCompany() {
  const result = await pool.query("SELECT * FROM companies WHERE name = 'Northstar Labs'");
  return result.rows[0];
}

router.get("/", requireAuth, async (req, res) => {
  const company = await getCompany();
  if (!company) return res.status(404).json({ error: "Company not found" });

  await pool.query("INSERT INTO company_page_views (company_id, viewer_id) VALUES ($1, $2)", [company.id, req.userId]);
  const [followers, posts, jobs] = await Promise.all([
    pool.query("SELECT COUNT(*)::int AS count FROM company_followers WHERE company_id = $1", [company.id]),
    pool.query(`SELECT p.*, c.name AS company_name, c.tagline AS company_tagline, c.logo_url
      FROM company_posts p JOIN companies c ON c.id = p.company_id
      WHERE p.company_id = $1 ORDER BY p.created_at DESC`, [company.id]),
    pool.query("SELECT id, title, location, employment_type AS type FROM jobs WHERE company_id = $1 ORDER BY created_at DESC", [company.id]),
  ]);
  const following = await pool.query("SELECT 1 FROM company_followers WHERE company_id = $1 AND user_id = $2", [company.id, req.userId]);

  res.json({
    id: company.id,
    name: company.name,
    tagline: company.tagline,
    about: company.about,
    website: company.website,
    industry: company.industry,
    size: company.company_size,
    location: company.location,
    founded: company.founded_year,
    logoUrl: company.logo_url,
    bannerUrl: company.banner_url,
    followerCount: followers.rows[0].count,
    following: Boolean(following.rows[0]),
    posts: posts.rows.map(shapePost),
    jobs: jobs.rows,
  });
});

router.post("/follow", requireAuth, async (req, res) => {
  const company = await getCompany();
  const existing = await pool.query("SELECT 1 FROM company_followers WHERE company_id = $1 AND user_id = $2", [company.id, req.userId]);
  if (existing.rows[0]) {
    await pool.query("DELETE FROM company_followers WHERE company_id = $1 AND user_id = $2", [company.id, req.userId]);
    return res.json({ following: false });
  }
  await pool.query("INSERT INTO company_followers (company_id, user_id) VALUES ($1, $2)", [company.id, req.userId]);
  res.json({ following: true });
});

router.post("/invite", requireAuth, async (req, res) => {
  const company = await getCompany();
  await pool.query("INSERT INTO company_invites (company_id, inviter_id) VALUES ($1, $2)", [company.id, req.userId]);
  res.status(201).json({ sent: true });
});

router.get("/analytics", requireAuth, async (req, res) => {
  const company = await getCompany();
  const [views, followers, invites] = await Promise.all([
    pool.query("SELECT COUNT(*)::int AS count FROM company_page_views WHERE company_id = $1", [company.id]),
    pool.query("SELECT COUNT(*)::int AS count FROM company_followers WHERE company_id = $1", [company.id]),
    pool.query("SELECT COUNT(*)::int AS count FROM company_invites WHERE company_id = $1", [company.id]),
  ]);
  res.json({ uniqueVisitors: views.rows[0].count, followers: followers.rows[0].count, invites: invites.rows[0].count, engagement: 64 });
});

module.exports = router;
