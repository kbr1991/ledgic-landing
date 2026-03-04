# KBR & Co. — Official Website

Node.js + Express + PostgreSQL website for KBR & Co. Chartered Accountants.

## Stack
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **View Engine:** EJS
- **Database:** PostgreSQL (Railway managed)
- **Email:** Nodemailer via Zoho Mail (admin@kbrandco.com)

---

## Monorepo Setup

This lives in `/kbrandco/` within the shared GitHub repository.

In **Railway**, create a new service and set:
- **Root Directory:** `kbrandco`
- **Start Command:** `node server.js`

---

## Environment Variables (set in Railway)

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `SESSION_SECRET` | Random 32+ char string |
| `DATABASE_URL` | Auto-injected by Railway PostgreSQL |
| `ADMIN_USERNAME` | Your admin username |
| `ADMIN_PASSWORD` | Your admin password |
| `ZOHO_HOST` | `smtp.zoho.in` |
| `ZOHO_PORT` | `465` |
| `ZOHO_SECURE` | `true` |
| `ZOHO_USER` | `admin@kbrandco.com` |
| `ZOHO_PASS` | Zoho App Password |
| `NOTIFY_EMAIL` | `admin@kbrandco.com` |

---

## First Deployment

1. Push code to GitHub
2. Create Railway service → point to `/kbrandco` root
3. Add PostgreSQL plugin in Railway
4. Set all environment variables above
5. Deploy — DB schema is auto-created on first start
6. Run seed: in Railway terminal: `node seed.js`

## Admin Panel

URL: `https://your-domain.com/admin`

Features:
- Blog CMS (create, edit, publish/unpublish, delete posts — Markdown supported)
- View and manage contact form enquiries
- View and manage career applications

## Custom Domain (kbrandco.com)

In Railway: Settings → Domains → Add custom domain → `www.kbrandco.com`
Then in GoDaddy DNS: CNAME `www` → Railway-provided hostname.

---

*Designed to match the Ledgic Practice aesthetic. Dark navy, gold accents, Playfair Display headings.*
