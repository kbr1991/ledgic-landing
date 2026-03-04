const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const sanitizeHtml = require('sanitize-html');
const { pool } = require('../db');

// ── Mailer ────────────────────────────────────────────────────────────────────
function createTransport() {
  return nodemailer.createTransport({
    host: process.env.ZOHO_HOST || 'smtp.zoho.in',
    port: parseInt(process.env.ZOHO_PORT) || 465,
    secure: process.env.ZOHO_SECURE !== 'false',
    auth: {
      user: process.env.ZOHO_USER,
      pass: process.env.ZOHO_PASS,
    },
  });
}

function clean(str) {
  return sanitizeHtml(String(str || '').trim(), { allowedTags: [], allowedAttributes: {} });
}

// ── Contact Form ──────────────────────────────────────────────────────────────
router.post('/contact', async (req, res) => {
  try {
    const name    = clean(req.body.name);
    const email   = clean(req.body.email);
    const phone   = clean(req.body.phone);
    const message = clean(req.body.message);

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    await pool.query(
      'INSERT INTO contact_submissions (name, email, phone, message) VALUES ($1,$2,$3,$4)',
      [name, email, phone, message]
    );

    if (process.env.ZOHO_USER && process.env.ZOHO_PASS) {
      const transport = createTransport();
      await transport.sendMail({
        from: `"KBR & Co. Website" <${process.env.ZOHO_USER}>`,
        to: process.env.NOTIFY_EMAIL || 'admin@kbrandco.com',
        replyTo: email,
        subject: `New Contact Enquiry – ${name}`,
        html: `
          <h2 style="color:#C8A951;">New Contact Form Submission</h2>
          <table style="border-collapse:collapse;width:100%;">
            <tr><td style="padding:8px;font-weight:bold;">Name</td><td style="padding:8px;">${name}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Phone</td><td style="padding:8px;">${phone || '—'}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Message</td><td style="padding:8px;">${message}</td></tr>
          </table>`,
      });
    }

    res.json({ success: true, message: 'Thank you. We will be in touch shortly.' });
  } catch (err) {
    console.error('Contact API error:', err);
    res.status(500).json({ error: 'Could not submit. Please try again or email us directly.' });
  }
});

// ── Careers Form ──────────────────────────────────────────────────────────────
router.post('/careers', async (req, res) => {
  try {
    const name       = clean(req.body.name);
    const email      = clean(req.body.email);
    const phone      = clean(req.body.phone);
    const position   = clean(req.body.position);
    const expertise  = clean(req.body.expertise);
    const additional = clean(req.body.additional);

    if (!name || !email || !position) {
      return res.status(400).json({ error: 'Name, email and position are required.' });
    }

    await pool.query(
      'INSERT INTO career_applications (name, email, phone, position, expertise, additional_info) VALUES ($1,$2,$3,$4,$5,$6)',
      [name, email, phone, position, expertise, additional]
    );

    if (process.env.ZOHO_USER && process.env.ZOHO_PASS) {
      const transport = createTransport();
      await transport.sendMail({
        from: `"KBR & Co. Website" <${process.env.ZOHO_USER}>`,
        to: process.env.NOTIFY_EMAIL || 'admin@kbrandco.com',
        replyTo: email,
        subject: `New Career Application – ${name} (${position})`,
        html: `
          <h2 style="color:#C8A951;">New Career Application</h2>
          <table style="border-collapse:collapse;width:100%;">
            <tr><td style="padding:8px;font-weight:bold;">Name</td><td style="padding:8px;">${name}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Phone</td><td style="padding:8px;">${phone || '—'}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Position</td><td style="padding:8px;">${position}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Expertise</td><td style="padding:8px;">${expertise || '—'}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Notes</td><td style="padding:8px;">${additional || '—'}</td></tr>
          </table>`,
      });
    }

    res.json({ success: true, message: 'Application received. We will review and reach out if there is a suitable opening.' });
  } catch (err) {
    console.error('Careers API error:', err);
    res.status(500).json({ error: 'Could not submit application. Please try again.' });
  }
});

module.exports = router;
