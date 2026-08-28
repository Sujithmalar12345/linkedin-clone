const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const pool = require("../db");
const requireAuth = require("../middleware/auth");

const router = express.Router();
const upload = multer({
  dest: path.join(__dirname, "../uploads"),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) return callback(null, true);
    callback(new Error("Only image and video files are supported"));
  },
});

const FEED_QUERY = `
  SELECT
    p.id,
    p.content,
    p.media_url,
    p.media_type,
    p.created_at,
    u.id AS author_id,
    u.name AS author_name,
    u.headline AS author_headline,
    u.avatar_url AS author_avatar_url,
    COUNT(l.id)::int AS like_count,
    BOOL_OR(l.user_id = $1) AS liked_by_me
  FROM posts p
  JOIN users u ON u.id = p.user_id
  LEFT JOIN likes l ON l.post_id = p.id
  GROUP BY p.id, u.id
  ORDER BY p.created_at DESC
  LIMIT 50
`;

function shapePost(row) {
  return {
    id: row.id,
    content: row.content,
    mediaUrl: row.media_url,
    mediaType: row.media_type,
    createdAt: row.created_at,
    likeCount: row.like_count,
    likedByMe: row.liked_by_me,
    author: {
      id: row.author_id,
      name: row.author_name,
      headline: row.author_headline,
      avatarUrl: row.author_avatar_url,
    },
  };
}

router.post("/media", requireAuth, (req, res) => {
  upload.single("media")(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: "Choose an image or video file" });

    const extension = path.extname(req.file.originalname).toLowerCase() || ".bin";
    const filename = `${crypto.randomUUID()}${extension}`;
    const finalPath = path.join(path.dirname(req.file.path), filename);
    require("fs").renameSync(req.file.path, finalPath);
    res.status(201).json({ mediaUrl: `/api/uploads/${filename}`, mediaType: req.file.mimetype.startsWith("video/") ? "video" : "image" });
  });
});

// Feed: all posts, newest first. requireAuth optional here (viewerId used for likedByMe)
router.get("/", requireAuth, async (req, res) => {
  const result = await pool.query(FEED_QUERY, [req.userId]);
  res.json(result.rows.map(shapePost));
});

// Posts by a specific user (for their profile page)
router.get("/user/:userId", requireAuth, async (req, res) => {
  const result = await pool.query(
    `SELECT
      p.id, p.content, p.media_url, p.media_type, p.created_at,
       u.id AS author_id, u.name AS author_name, u.headline AS author_headline, u.avatar_url AS author_avatar_url,
       COUNT(l.id)::int AS like_count,
       BOOL_OR(l.user_id = $1) AS liked_by_me
     FROM posts p
     JOIN users u ON u.id = p.user_id
     LEFT JOIN likes l ON l.post_id = p.id
     WHERE p.user_id = $2
     GROUP BY p.id, u.id
     ORDER BY p.created_at DESC`,
    [req.userId, req.params.userId]
  );
  res.json(result.rows.map(shapePost));
});

router.post("/", requireAuth, async (req, res) => {
  const { content, mediaUrl = "", mediaType = "" } = req.body;
  if ((!content || !content.trim()) && !mediaUrl) {
    return res.status(400).json({ error: "Add text or choose a photo/video" });
  }
  if (mediaUrl && !/^https?:\/\//i.test(mediaUrl)) {
    return res.status(400).json({ error: "Media URL must start with http:// or https://" });
  }
  if (mediaUrl && !["image", "video"].includes(mediaType)) {
    return res.status(400).json({ error: "Media type must be image or video" });
  }

  const inserted = await pool.query(
    "INSERT INTO posts (user_id, content, media_url, media_type) VALUES ($1, $2, $3, $4) RETURNING id",
    [req.userId, (content || "").trim(), mediaUrl.trim(), mediaUrl ? mediaType : ""]
  );

  const result = await pool.query(
    `SELECT
      p.id, p.content, p.media_url, p.media_type, p.created_at,
       u.id AS author_id, u.name AS author_name, u.headline AS author_headline, u.avatar_url AS author_avatar_url,
       0::int AS like_count,
       FALSE AS liked_by_me
     FROM posts p JOIN users u ON u.id = p.user_id
     WHERE p.id = $1`,
    [inserted.rows[0].id]
  );

  res.status(201).json(shapePost(result.rows[0]));
});

router.delete("/:id", requireAuth, async (req, res) => {
  const result = await pool.query(
    "DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING id",
    [req.params.id, req.userId]
  );
  if (!result.rows[0]) {
    return res.status(404).json({ error: "Post not found or not yours to delete" });
  }
  res.status(204).end();
});

// Toggle like on a post
router.post("/:id/like", requireAuth, async (req, res) => {
  const postId = req.params.id;
  const existing = await pool.query(
    "SELECT id FROM likes WHERE post_id = $1 AND user_id = $2",
    [postId, req.userId]
  );

  if (existing.rows[0]) {
    await pool.query("DELETE FROM likes WHERE id = $1", [existing.rows[0].id]);
  } else {
    await pool.query(
      "INSERT INTO likes (post_id, user_id) VALUES ($1, $2)",
      [postId, req.userId]
    );
  }

  const countResult = await pool.query(
    "SELECT COUNT(*)::int AS count FROM likes WHERE post_id = $1",
    [postId]
  );

  res.json({
    liked: !existing.rows[0],
    likeCount: countResult.rows[0].count,
  });
});

module.exports = router;
