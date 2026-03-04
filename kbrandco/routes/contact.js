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
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
  }

  try {
    await pool.query(
      'INSERT INTO contact_submissions (name, email, phone, message) VALUES ($1,$2,$3,$4)',
      [name, email, phone || null, message]
    );

    const t = getTransporter();
    const ist = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Notification to KBR
    await t.sendMail({
      from: `"KBR & Co. Website" <${process.env.ZOHO_EMAIL}>`,
      to: process.env.NOTIFY_EMAIL || 'admin@kbrandco.com',
      replyTo: email,
      subject: `New Enquiry from ${name} — kbrandco.com`,
      html: `<h2 style="font-family:sans-serif">New Contact Enquiry</h2>
<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
  <tr><td style="padding:6px 12px;font-weight:bold">Name</td><td style="padding:6px 12px">${name}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold">Email</td><td style="padding:6px 12px">${email}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold">Phone</td><td style="padding:6px 12px">${phone || '—'}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold;vertical-align:top">Message</td><td style="padding:6px 12px">${message.replace(/\n/g, '<br>')}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold">Submitted</td><td style="padding:6px 12px">${ist} IST</td></tr>
</table>`
    });

    // Auto-reply
    await t.sendMail({
      from: `"KBR & Co." <${process.env.ZOHO_EMAIL}>`,
      to: email,
      subject: 'Thank you for contacting KBR & Co.',
      html: `<div style="font-family:sans-serif;max-width:560px">
<h2>Thank you, ${name}!</h2>
<p>We have received your enquiry and will respond within one business day.</p>
<p>For urgent matters, please call us directly at <strong>+91 95660 05748</strong>.</p>
<br>
<p>Warm regards,<br><strong>KBR & Co.</strong><br>Chartered Accountants, Chennai<br><em>Est. 1991</em></p>
</div>`
    });

    res.json({ success: true, message: 'Thank you! We will get back to you within one business day.' });
  } catch (err) {
    console.error('Contact form error:', err.message);
    res.status(500).json({ success: false, message: 'Something went wrong. Please call us at +91 95660 05748.' });
  }
});

module.exports = router;
