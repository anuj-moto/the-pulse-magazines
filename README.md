# The Pulse Magazines

The Pulse Magazines website and CMS — a self-owned successor to the
WordPress site at `thepulsemagazines.com`. One Next.js app, one Payload
CMS admin, one SQLite database, designed to be hosted on a single
Hostinger VPS.

> **Where every story matters.**

---

## What's in the box

- **Next.js 16 (App Router) + React 19 + TypeScript** — server-rendered
  pages with on-demand revalidation, so edits go live in seconds.
- **Payload CMS 3** — admin UI at `/admin`. The owner edits articles,
  magazine issues, categories, tags, authors, testimonials, pages,
  navigation, the homepage and site settings — no code, no WordPress.
- **SQLite via Drizzle** — one `pulse.db` file. Trivial to back up.
- **Tailwind v4** with the **"Ink & Paper"** editorial design system —
  Fraunces serif headlines on warm paper, one crimson accent.
- **Newsletter** stored in the CMS with a one-click CSV export.
- **Contact form** delivered to the owner's inbox over SMTP.
- **SEO**: per-page metadata, JSON-LD, dynamic sitemap, robots, RSS feed,
  301 redirects from old WordPress URLs.

---

## Requirements

- **Node 20 LTS or newer**
- **pnpm 9** (`corepack enable && corepack prepare pnpm@9 --activate`)
- macOS / Linux for development; Linux (Hostinger VPS, Ubuntu 22.04+)
  for production. (Windows works via WSL.)

---

## Local development

```bash
# 1. Install dependencies
pnpm install

# 2. Set up your local environment
cp .env.example .env
# Then edit .env — at minimum, generate a Payload secret:
#   openssl rand -hex 32   →  paste as PAYLOAD_SECRET

# 3. Create the SQLite tables
pnpm db:migrate

# 4. (One-time) Pull every article, magazine and image from the live
#    WordPress site into your local database. Idempotent — safe to re-run.
pnpm migrate:wp

# 5. Run the app
pnpm dev
```

- Public site → http://localhost:3000
- CMS admin   → http://localhost:3000/admin (creates the first user on
  visit)

To verify a production build locally:

```bash
pnpm build && pnpm start
```

---

## Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Run the dev server |
| `pnpm build` | Compile the production bundle |
| `pnpm start` | Run the production server |
| `pnpm lint` | Lint with ESLint |
| `pnpm db:migrate` | Apply Payload schema migrations |
| `pnpm db:migrate:create <name>` | Snapshot the current schema as a new migration |
| `pnpm db:migrate:status` | Show migration status |
| `pnpm generate:types` | Regenerate `src/payload-types.ts` |
| `pnpm generate:importmap` | Rebuild the Payload admin import map |
| `pnpm migrate:wp [--dry-run] [--only=articles]` | Pull content from the old WordPress site |
| `pnpm export:subscribers` | Export the newsletter list to a CSV file |

---

## Project layout

```
src/
├── app/
│   ├── (frontend)/            Public site (App Router routes)
│   ├── (payload)/             Payload admin UI + REST/GraphQL
│   ├── api/export-subscribers Auth-protected CSV download
│   ├── robots.ts              Robots.txt
│   └── sitemap.ts             sitemap.xml
├── collections/               Articles, Magazines, Categories, Tags,
│                              Authors, Media, Testimonials, Pages,
│                              Subscribers, ContactSubmissions, Users
├── globals/                   SiteSettings, Navigation, Homepage
├── fields/                    Reusable slug / seo / wpId fields
├── access/                    anyone / authenticated / publishedOrAuthenticated
├── hooks/                     Revalidation + contact-email hooks
├── components/                layout/ home/ content/ forms/ admin/ ui/
├── actions/                   Server actions (subscribe, submitContact)
├── lib/                       payload client, queries, seo, jsonld, format
├── migrations/                Committed Drizzle migration files
├── payload.config.ts          CMS configuration
└── payload-types.ts           AUTO-GENERATED — committed

scripts/                       One-time WordPress migration + utilities
deploy/                        nginx.conf.example, backup.sh.example
ecosystem.config.cjs           PM2 process definition
media/                         Uploaded images (gitignored)
pulse.db                       SQLite database (gitignored)
```

---

## Deploying to a Hostinger VPS

> **Prerequisite:** a Hostinger **VPS** plan (not shared hosting). The
> app needs to run a persistent Node.js process, which only the VPS
> tier supports. Hostinger KVM 1 is ample for this site.

### 1. Provision the server (one time)

```bash
# As a non-root sudo user on Ubuntu 22.04+
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git sqlite3 nginx certbot python3-certbot-nginx
sudo corepack enable
sudo npm i -g pm2
```

### 2. Deploy the app

```bash
sudo mkdir -p /var/www/pulse && sudo chown $USER:$USER /var/www/pulse
cd /var/www/pulse
git clone <your-repo-url> .

cp .env.example .env
chmod 600 .env
# Fill in: PAYLOAD_SECRET, NEXT_PUBLIC_SERVER_URL=https://thepulsemagazines.com,
# SMTP_HOST/USER/PASS/PORT, CONTACT_NOTIFY_EMAIL

pnpm install --frozen-lockfile
pnpm db:migrate
pnpm build

# Optional: pull existing WordPress content into production
pnpm migrate:wp

pm2 start ecosystem.config.cjs
pm2 save
pm2 startup        # follow the printed command — enables boot-time start
```

### 3. nginx + SSL

```bash
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/thepulsemagazines.com
# Edit the server_name lines if your domain differs
sudo ln -s /etc/nginx/sites-available/thepulsemagazines.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

sudo certbot --nginx -d thepulsemagazines.com -d www.thepulsemagazines.com
# Auto-renew is installed via certbot.timer.
```

### 4. DNS cutover

1. Lower your domain's A-record TTL to 300s the day before cutover.
2. Verify the new site over its server IP (edit `/etc/hosts` locally to
   test before DNS).
3. Point the A record to the VPS IP. Keep WordPress running until you
   confirm the new site is serving production traffic.

### 5. Backups

```bash
sudo cp deploy/backup.sh.example /usr/local/bin/pulse-backup
sudo chmod +x /usr/local/bin/pulse-backup
sudo crontab -e
# Add: 15 3 * * *  /usr/local/bin/pulse-backup
```

Nightly: hot-copies `pulse.db` (safe — SQLite WAL mode) and rsyncs the
`media/` folder. Weekly tarball on Sundays. 14-day retention.

### Updating later

```bash
cd /var/www/pulse
git pull
pnpm install --frozen-lockfile
pnpm db:migrate
pnpm build
pm2 restart pulse
```

---

## How the owner uses the CMS

- **Log in** at `https://thepulsemagazines.com/admin` with the user
  account created on first visit.
- **Publish an article** — "Content → Articles → Create new". Title,
  excerpt, featured image, body, category, then **Save & Publish**.
- **Feature it on the homepage** — "Settings → Homepage → Editor's
  Choice" — pick the article from the list.
- **Edit the navigation** — "Settings → Navigation Menus".
- **Read messages** — "Inbox → Contact Messages".
- **Download the newsletter list** — "Inbox → Subscribers → Export CSV".

All changes go live within a few seconds — no rebuild required.

---

## Environment variables

Every variable is documented inline in `.env.example`. The required
ones for production are:

| Variable | Purpose |
|---|---|
| `DATABASE_URI` | SQLite file path (e.g. `file:./pulse.db`) |
| `PAYLOAD_SECRET` | Long random string — `openssl rand -hex 32` |
| `NEXT_PUBLIC_SERVER_URL` | Public base URL, no trailing slash |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Outgoing email |
| `CONTACT_NOTIFY_EMAIL` | Inbox that receives contact-form messages |
| `WORDPRESS_API_URL` | Only needed if re-running `pnpm migrate:wp` |
| `FINNHUB_API_KEY` | Optional. Free key from [finnhub.io](https://finnhub.io/register) — powers the stocks half of the live market ticker. Without it, the ticker silently falls back to crypto-only (BTC / ETH / SOL via CoinGecko, which needs no key). |

---

## Notes & caveats

- **SQLite is single-writer.** The PM2 config runs one process on purpose
  — do not switch to cluster mode without first migrating to Postgres.
- **Email deliverability** depends on SPF/DKIM/DMARC DNS records on your
  domain. If contact-form emails land in spam, set those records and/or
  swap the Nodemailer adapter for a transactional service (Resend, etc.).
- **Magazine taxonomy** in WordPress used separate `magazine-category`
  and `magazine-tag` collections — the migration collapses them into the
  shared `categories` collection for simplicity.
- **Tags**: the WordPress site had 826 raw tags but most were unused or
  malformed hashtag strings — only tags actually attached to an article
  (~700) are migrated.
- **About page** is re-authored fresh from the existing copy — the
  WordPress original was Elementor markup that wouldn't have round-tripped
  cleanly. Edit it in the CMS as you like.
- **Live market ticker** at the top of every page caches its data for
  60 seconds per process. With `FINNHUB_API_KEY` set it shows
  SPY/QQQ/AAPL/MSFT/NVDA/GOOGL/META/TSLA + BTC/ETH/SOL. Without it,
  crypto only. The whole band hides if both providers are unreachable.

---

## License

Proprietary — © The Pulse Magazines.
