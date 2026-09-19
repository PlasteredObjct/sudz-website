require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

const app = express();
// Sits behind the nginx reverse proxy (see nginx.conf) — trust its
// X-Forwarded-For so express-rate-limit keys on the real client IP.
app.set('trust proxy', 1);
// Same-origin requests (the normal case — nginx serves the site and proxies
// /api/ under the same domain) don't need CORS headers at all, so this only
// opts in when ALLOWED_ORIGIN is explicitly set (e.g. hitting the backend
// directly from a different port in local dev). Wildcard CORS would let any
// third-party site's JS call this endpoint from a visitor's browser.
if (process.env.ALLOWED_ORIGIN) {
  app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));
}
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
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 300;

// Strips characters that don't belong in an email header value (newlines
// especially — a raw CR/LF in a header lets an attacker inject extra
// headers, e.g. Bcc). Nodemailer already encodes headers safely on its
// own, but this is a cheap, obvious belt-and-suspenders check on values
// that came straight from a public, unauthenticated form.
function sanitizeHeaderValue(value) {
  return String(value).replace(/[\r\n]+/g, ' ').slice(0, MAX_FIELD_LENGTH);
}

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

  if (!EMAIL_RE.test(String(body.email).trim())) {
    return res.status(400).json({ ok: false, error: 'Please enter a valid email address' });
  }

  const name = sanitizeHeaderValue(body.name);
  const email = sanitizeHeaderValue(body.email);

  const lines = [
    `Name: ${name}`,
    `Phone: ${sanitizeHeaderValue(body.phone)}`,
    `Email: ${email}`,
    `Service: ${body.service ? sanitizeHeaderValue(body.service) : 'Not specified'}`,
    `Preferred Date: ${body.date ? sanitizeHeaderValue(body.date) : 'Not specified'}`,
    `Vehicle: ${sanitizeHeaderValue(body.vehicle)}`,
    `Service Location: ${sanitizeHeaderValue(body.location)}`
  ];

  try {
    await transporter.sendMail({
      from: `"SUDZ Website" <${process.env.GMAIL_USER}>`,
      to: process.env.TO_EMAIL || process.env.GMAIL_USER,
      replyTo: email,
      subject: `New Quote Request — ${name}`,
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
