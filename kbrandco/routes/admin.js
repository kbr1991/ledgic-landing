const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { marked } = require('marked');
const slugify = require('slugify');
const sanitizeHtml = require('sanitize-html');

marked.setOptions({ breaks: true, gfm: true });

// ── Auth Middleware ────────────────────────────────────────────────────────────
function requireAuth(req, res, next) {
  if (req.session && req.session.adminAuthenticated) return next();
  res.redirect('/admin/login');
}

// ── Login ─────────────────────────────────────────────────────────────────────
router.get('/login', (req, res) => {
  if (req.session.adminAuthenticated) return res.redirect('/admin');
  res.render('admin/login', { title: 'Admin Login', error: null });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const validUser = username === process.env.ADMIN_USERNAME;
  const validPass = password === process.env.ADMIN_PASSWORD;
  if (validUser && validPass) {
    req.session.adminAuthenticated = true;
    return res.redirect('/admin');
  }
  res.render('admin/login', { title: 'Admin Login', error: 'Invalid credentials.' });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// ── Dashboard ─────────────────────────────────────────────────────────────────
router.get('/', requireAuth, async (req, res) => {
  try {
    const [posts, contacts, careers] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM blog_posts'),
      pool.query('SELECT COUNT(*) FROM contact_submissions'),
      pool.query('SELECT COUNT(*) FROM career_applications'),
    ]);
    const recent = await pool.query('SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 5');
    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      stats: {
        posts: posts.rows[0].count,
        contacts: contacts.rows[0].count,
        careers: careers.rows[0].count,
      },
      recentContacts: recent.rows,
    });
  } catch (err) {
    console.error(err);
    res.render('admin/dashboard', { title: 'Admin Dashboard', stats: { posts:0, contacts:0, careers:0 }, recentContacts: [] });
  }
});

// ── Blog Posts ────────────────────────────────────────────────────────────────
router.get('/posts', requireAuth, async (req, res) => {
  const { rows } = await pool.query('SELECT id, title, slug, published, created_at FROM blog_posts ORDER BY created_at DESC');
  res.render('admin/posts', { title: 'Manage Blog Posts', posts: rows });
});

router.get('/posts/new', requireAuth, (req, res) => {
  res.render('admin/post-form', { title: 'New Post', post: null, error: null });
});

router.post('/posts/new', requireAuth, async (req, res) => {
  try {
    const title     = sanitizeHtml(req.body.title?.trim() || '', { allowedTags: [] });
    const excerpt   = sanitizeHtml(req.body.excerpt?.trim() || '', { allowedTags: [] });
    const content   = req.body.content?.trim() || '';
    const tags      = sanitizeHtml(req.body.tags?.trim() || '', { allowedTags: [] });
    const read_time = parseInt(req.body.read_time) || 5;
    const published = req.body.published === 'on';

    if (!title || !content) return res.render('admin/post-form', { title: 'New Post', post: req.body, error: 'Title and content are required.' });

    const slug = slugify(title, { lower: true, strict: true });
    await pool.query(
      'INSERT INTO blog_posts (title, slug, excerpt, content, tags, read_time, published) VALUES ($1,$2,$3,$4,$5,$6,$7)',
      [title, slug, excerpt, content, tags, read_time, published]
    );
    res.redirect('/admin/posts');
  } catch (err) {
    console.error(err);
    res.render('admin/post-form', { title: 'New Post', post: req.body, error: 'Could not save post. Slug may already exist.' });
  }
});

router.get('/posts/:id/edit', requireAuth, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM blog_posts WHERE id = $1', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/posts');
  res.render('admin/post-form', { title: 'Edit Post', post: rows[0], error: null });
});

router.post('/posts/:id/edit', requireAuth, async (req, res) => {
  try {
    const title     = sanitizeHtml(req.body.title?.trim() || '', { allowedTags: [] });
    const excerpt   = sanitizeHtml(req.body.excerpt?.trim() || '', { allowedTags: [] });
    const content   = req.body.content?.trim() || '';
    const tags      = sanitizeHtml(req.body.tags?.trim() || '', { allowedTags: [] });
    const read_time = parseInt(req.body.read_time) || 5;
    const published = req.body.published === 'on';

    await pool.query(
      'UPDATE blog_posts SET title=$1, excerpt=$2, content=$3, tags=$4, read_time=$5, published=$6, updated_at=NOW() WHERE id=$7',
      [title, excerpt, content, tags, read_time, published, req.params.id]
    );
    res.redirect('/admin/posts');
  } catch (err) {
    console.error(err);
    res.redirect(`/admin/posts/${req.params.id}/edit`);
  }
});

router.post('/posts/:id/delete', requireAuth, async (req, res) => {
  await pool.query('DELETE FROM blog_posts WHERE id = $1', [req.params.id]);
  res.redirect('/admin/posts');
});

router.post('/posts/:id/toggle', requireAuth, async (req, res) => {
  await pool.query('UPDATE blog_posts SET published = NOT published WHERE id = $1', [req.params.id]);
  res.redirect('/admin/posts');
});

// ── Contact Submissions ───────────────────────────────────────────────────────
router.get('/contacts', requireAuth, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM contact_submissions ORDER BY created_at DESC');
  res.render('admin/contacts', { title: 'Contact Submissions', contacts: rows });
});

router.post('/contacts/:id/delete', requireAuth, async (req, res) => {
  await pool.query('DELETE FROM contact_submissions WHERE id = $1', [req.params.id]);
  res.redirect('/admin/contacts');
});

// ── Career Applications ───────────────────────────────────────────────────────
router.get('/careers', requireAuth, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM career_applications ORDER BY created_at DESC');
  res.render('admin/careers', { title: 'Career Applications', applications: rows });
});

router.post('/careers/:id/delete', requireAuth, async (req, res) => {
  await pool.query('DELETE FROM career_applications WHERE id = $1', [req.params.id]);
  res.redirect('/admin/careers');
});

module.exports = router;
