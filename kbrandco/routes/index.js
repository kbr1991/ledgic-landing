const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const { rows: blogPosts } = await pool.query(
      `SELECT id, slug, title, excerpt, category, read_time, published_at
       FROM blog_posts WHERE published = true
       ORDER BY published_at DESC LIMIT 3`
    );
    res.render('index', {
      title: 'KBR & Co. | Chartered Accountants | Chennai | Since 1991',
      blogPosts,
      currentPath: '/'
    });
  } catch (err) {
    console.error(err);
    res.render('index', { title: 'KBR & Co. | Chartered Accountants', blogPosts: [], currentPath: '/' });
  }
});

module.exports = router;
