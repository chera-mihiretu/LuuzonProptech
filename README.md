## Luuzon PropTech – Developer Guide

### Prerequisites
- Node.js 18+ (recommended 20+)
- pnpm 9+

### 1) Environment setup (.env-example → .env)
Copy the example env file and fill in values:

```bash
cp .env-example .env
```

Required variables (you can keep local-safe defaults from the template):

```dotenv
# Database
MONGODB_URI=mongodb://localhost:27017/luuzon_proptech

# App
BETTER_AUTH_URL=http://localhost:3000/api/auth

# SMTP Email (Nodemailer)
EMAIL_PROVIDER=nodemailer
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
SENDER_EMAIL=no-reply@localhost

# Social login
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Optional – legacy/resend
RESEND_API_KEY=
OUR_DOMAIN_EMAIL=no-reply@localhost
```

Notes:
- For local email testing, run MailHog/Mailpit (SMTP on 1025) and keep the host/port above.
- `MONGODB_URI` must point to a running MongoDB instance.

### 2) Install dependencies (pnpm)

```bash
pnpm install
```

### 3) Run in development

```bash
pnpm dev
```

Then open `http://localhost:3000`.

> **Note:** This project have containerized for a smooth developer but since there is issue not resolved yet your local machine to run the project soon.

### Common scripts
- `pnpm dev` – start Next.js in development
- `pnpm build` – production build
- `pnpm start` – start production server (after build)

