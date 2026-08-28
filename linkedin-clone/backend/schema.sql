-- Run this once against your Postgres database to create the tables.

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  headline TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_url TEXT DEFAULT '',
  media_type TEXT DEFAULT '' CHECK (media_type IN ('', 'image', 'video')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE posts ADD COLUMN IF NOT EXISTS media_url TEXT DEFAULT '';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT '';

CREATE TABLE IF NOT EXISTS likes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes (post_id);

CREATE TABLE IF NOT EXISTS connections (
  id SERIAL PRIMARY KEY,
  requester_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  addressee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (requester_id, addressee_id),
  CHECK (requester_id <> addressee_id)
);

CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  company_id INTEGER,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT 'Remote',
  employment_type TEXT NOT NULL DEFAULT 'Full-time',
  category TEXT NOT NULL DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (title, company)
);

CREATE TABLE IF NOT EXISTS saved_jobs (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, job_id)
);

CREATE TABLE IF NOT EXISTS conversations (
  id SERIAL PRIMARY KEY,
  participant_one INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  participant_two INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (participant_one, participant_two),
  CHECK (participant_one < participant_two)
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  actor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages (conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  tagline TEXT NOT NULL DEFAULT '',
  about TEXT NOT NULL DEFAULT '',
  website TEXT NOT NULL DEFAULT '',
  industry TEXT NOT NULL DEFAULT '',
  company_size TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  founded_year INTEGER,
  logo_url TEXT NOT NULL DEFAULT '',
  banner_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS company_followers (
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (company_id, user_id)
);

CREATE TABLE IF NOT EXISTS company_invites (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  inviter_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS company_posts (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  like_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS company_page_views (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  viewer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO companies (name, tagline, about, website, industry, company_size, location, founded_year)
VALUES ('Northstar Labs', 'Tools for teams doing their best work.', 'Northstar Labs builds thoughtful software for modern teams. We care about clear communication, durable systems, and making work feel a little more human.', 'northstarlabs.example', 'Software Development', '51-200 employees', 'New York, NY', 2018)
ON CONFLICT (name) DO NOTHING;

UPDATE jobs SET company_id = (SELECT id FROM companies WHERE name = 'Northstar Labs')
WHERE company = 'Northstar Labs' AND company_id IS NULL;

INSERT INTO jobs (company_id, title, company, location, employment_type, category) VALUES
  ((SELECT id FROM companies WHERE name = 'Northstar Labs'), 'Frontend Engineer', 'Northstar Labs', 'New York, NY', 'Full-time', 'Engineering'),
  ((SELECT id FROM companies WHERE name = 'Northstar Labs'), 'Community Lead', 'Northstar Labs', 'Remote', 'Contract', 'Community')
ON CONFLICT (title, company) DO NOTHING;

INSERT INTO company_posts (company_id, content, like_count)
SELECT id, 'We are building a calmer way for teams to plan, share context, and make decisions together. Follow along as we share what we learn.', 36
FROM companies WHERE name = 'Northstar Labs'
AND NOT EXISTS (SELECT 1 FROM company_posts WHERE content LIKE 'We are building a calmer way%');

INSERT INTO company_posts (company_id, content, like_count)
SELECT id, 'Our latest field note: great collaboration starts with making the invisible work visible. Read the full story on our site.', 21
FROM companies WHERE name = 'Northstar Labs'
AND NOT EXISTS (SELECT 1 FROM company_posts WHERE content LIKE 'Our latest field note%');

INSERT INTO jobs (title, company, location, employment_type, category) VALUES
  ('Senior Product Designer', 'Northstar Labs', 'Remote', 'Full-time', 'Design'),
  ('Frontend Engineer', 'Field Notes', 'New York, NY', 'Full-time', 'Engineering'),
  ('Community Lead', 'Good Work Studio', 'Austin, TX', 'Contract', 'Community'),
  ('Data Analyst', 'Signal House', 'Remote', 'Full-time', 'Data')
ON CONFLICT (title, company) DO NOTHING;
