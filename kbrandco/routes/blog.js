const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { marked } = require('marked');

marked.setOptions({ breaks: true, gfm: true });

router.get('/', async (req, res) => {
  try {
    const { rows: posts } = await pool.query(
      `SELECT id, slug, title, excerpt, category, read_time, published_at
       FROM blog_posts WHERE published = true ORDER BY published_at DESC`
    );
    res.render('blog', { title: 'Insights & Updates | KBR & Co.', posts, currentPath: '/blog' });
  } catch (err) {
    console.error(err);
    res.status(500).render('404', { title: 'Error | KBR & Co.' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM blog_posts WHERE slug = $1 AND published = true',
      [req.params.slug]
    );
    if (!rows.length) return res.status(404).render('404', { title: 'Post Not Found | KBR & Co.' });

    const post = rows[0];
    post.contentHtml = marked.parse(post.content);

    const { rows: related } = await pool.query(
      `SELECT slug, title, category, read_time, published_at FROM blog_posts
       WHERE published = true AND id != $1 ORDER BY published_at DESC LIMIT 3`,
      [post.id]
    );

    res.render('blog-post', {
      title: `${post.title} | KBR & Co.`,
      post, related,
      currentPath: '/blog'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('404', { title: 'Error | KBR & Co.' });
  }
});

module.exports = router;
