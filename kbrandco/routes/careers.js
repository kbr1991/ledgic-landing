const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const nodemailer = require('nodemailer');

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.zoho.in',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.ZOHO_EMAIL || 'admin@kbrandco.com',
      pass: process.env.ZOHO_PASSWORD
    }
  });
}

router.post('/', async (req, res) => {
  const { full_name, email, phone, position, expertise, resume_url, additional_info } = req.body;
  if (!full_name || !email || !position) {
    return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
  }

  try {
    await pool.query(
      `INSERT INTO careers_submissions (full_name, email, phone, position, expertise, resume_url, additional_info)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [full_name, email, phone || null, position, expertise || null, resume_url || null, additional_info || null]
    );

    const t = getTransporter();
    const ist = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    await t.sendMail({
      from: `"KBR & Co. Website" <${process.env.ZOHO_EMAIL}>`,
      to: process.env.NOTIFY_EMAIL || 'admin@kbrandco.com',
      replyTo: email,
      subject: `New Application: ${position} — ${full_name}`,
      html: `<h2 style="font-family:sans-serif">New Career Application</h2>
<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
  <tr><td style="padding:6px 12px;font-weight:bold">Name</td><td style="padding:6px 12px">${full_name}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold">Email</td><td style="padding:6px 12px">${email}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold">Phone</td><td style="padding:6px 12px">${phone || '—'}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold">Position</td><td style="padding:6px 12px">${position}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold">Expertise</td><td style="padding:6px 12px">${expertise || '—'}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold">Resume URL</td><td style="padding:6px 12px">${resume_url ? `<a href="${resume_url}">${resume_url}</a>` : '—'}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold;vertical-align:top">Additional Info</td><td style="padding:6px 12px">${additional_info || '—'}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold">Submitted</td><td style="padding:6px 12px">${ist} IST</td></tr>
</table>`
    });

    await t.sendMail({
      from: `"KBR & Co." <${process.env.ZOHO_EMAIL}>`,
      to: email,
      subject: 'Application Received — KBR & Co.',
      html: `<div style="font-family:sans-serif;max-width:560px">
<h2>Thank you for applying, ${full_name}!</h2>
<p>We have received your application for the position of <strong>${position}</strong> at KBR & Co.</p>
<p>Our team will review your application and reach out if there is a suitable opportunity. We appreciate your interest in joining our firm.</p>
<br>
<p>Warm regards,<br><strong>KBR & Co.</strong><br>Chartered Accountants, Chennai<br><em>Est. 1991</em></p>
</div>`
    });

    res.json({ success: true, message: 'Application submitted! We will review and reach out if there is a match.' });
  } catch (err) {
    console.error('Careers form error:', err.message);
    res.status(500).json({ success: false, message: 'Something went wrong. Please email us at info@kbrandco.com.' });
  }
});

module.exports = router;
