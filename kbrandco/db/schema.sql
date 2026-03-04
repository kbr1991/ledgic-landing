CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(300) UNIQUE NOT NULL,
  title VARCHAR(600) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'General',
  read_time VARCHAR(50),
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS careers_submissions (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  position VARCHAR(255),
  expertise VARCHAR(500),
  resume_url VARCHAR(500),
  additional_info TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  sid VARCHAR NOT NULL COLLATE "default",
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL,
  CONSTRAINT session_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE
) WITH (OIDS=FALSE);

CREATE INDEX IF NOT EXISTS IDX_session_expire ON admin_sessions (expire);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_blog_updated_at ON blog_posts;
CREATE TRIGGER trg_blog_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
