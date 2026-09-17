require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

const app = express();
// Sits behind the nginx reverse proxy (see nginx.conf) — trust its
// X-Forwarded-For so express-rate-limit keys on the real client IP.
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

const quoteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Too many requests. Please call or text us directly.' }
});

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

const REQUIRED_FIELDS = ['name', 'phone', 'email', 'vehicle', 'location'];

app.post('/api/quote', quoteLimiter, async (req, res) => {
  const body = req.body || {};

  // Honeypot: bots fill this hidden field, real users never see it
  if (body.website) {
    return res.json({ ok: true });
  }

  const missing = REQUIRED_FIELDS.filter((field) => !body[field] || !String(body[field]).trim());
  if (missing.length) {
    return res.status(400).json({ ok: false, error: `Missing required field(s): ${missing.join(', ')}` });
  }

  const lines = [
    `Name: ${body.name}`,
    `Phone: ${body.phone}`,
    `Email: ${body.email}`,
    `Service: ${body.service || 'Not specified'}`,
    `Preferred Date: ${body.date || 'Not specified'}`,
    `Vehicle: ${body.vehicle}`,
    `Service Location: ${body.location}`
  ];

  try {
    await transporter.sendMail({
      from: `"SUDZ Website" <${process.env.GMAIL_USER}>`,
      to: process.env.TO_EMAIL || process.env.GMAIL_USER,
      replyTo: body.email,
      subject: `New Quote Request — ${body.name}`,
      text: lines.join('\n')
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Failed to send quote email:', err);
    res.status(502).json({ ok: false, error: 'Failed to send email' });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Quote backend listening on port ${PORT}`));
