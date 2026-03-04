const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { marked } = require('marked');

marked.setOptions({ breaks: true, gfm: true });

// Home page
router.get('/', async (req, res) => {
  try {
    const { rows: posts } = await pool.query(
      'SELECT id, title, slug, excerpt, tags, read_time, created_at FROM blog_posts WHERE published = true ORDER BY created_at DESC LIMIT 3'
    );
    res.render('index', { title: 'KBR & Co. — Chartered Accountants | Since 1991', posts });
  } catch (err) {
    console.error(err);
    res.render('index', { title: 'KBR & Co. — Chartered Accountants | Since 1991', posts: [] });
  }
});

// Blog listing
router.get('/blog', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const offset = (page - 1) * limit;
    const tag = req.query.tag || null;

    let query = 'SELECT id, title, slug, excerpt, tags, read_time, created_at FROM blog_posts WHERE published = true';
    let countQuery = 'SELECT COUNT(*) FROM blog_posts WHERE published = true';
    const params = [];

    if (tag) {
      query += ` AND tags ILIKE $1`;
      countQuery += ` AND tags ILIKE $1`;
      params.push(`%${tag}%`);
    }

    query += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const [{ rows: posts }, { rows: countRows }] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, params)
    ]);

    const total = parseInt(countRows[0].count);
    res.render('blog', {
      title: 'Blog & Insights — KBR & Co.',
      posts,
      page,
      totalPages: Math.ceil(total / limit),
      tag,
    });
  } catch (err) {
    console.error(err);
    res.render('blog', { title: 'Blog — KBR & Co.', posts: [], page: 1, totalPages: 1, tag: null });
  }
});

// Individual blog post
router.get('/blog/:slug', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM blog_posts WHERE slug = $1 AND published = true',
      [req.params.slug]
    );
    if (!rows.length) return res.status(404).render('404', { title: 'Post Not Found' });
    const post = rows[0];
    post.contentHtml = marked.parse(post.content || '');
    res.render('blog-post', { title: `${post.title} — KBR & Co.`, post });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { title: 'Error', message: 'Could not load post.' });
  }
});

module.exports = router;
