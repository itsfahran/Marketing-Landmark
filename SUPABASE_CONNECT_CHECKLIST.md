# Supabase Connection Checklist

Once you have your Supabase project, follow these steps to get the system live.

---

## Step 1: Get Your Credentials

1. Go to [supabase.com](https://supabase.com) → Log in → Select your project
2. Click **Settings** (bottom left)
3. Click **API** (left sidebar under "Configuration")
4. Copy these values:
   - **Project URL** → `SUPABASE_URL` (looks like `https://abc123.supabase.co`)
   - **Anon Key** → `SUPABASE_ANON_KEY` (starts with `eyJ...`)
   - **Service Role Key** → `SUPABASE_SERVICE_ROLE_KEY` (starts with `eyJ...` but longer, **keep secret**)

---

## Step 2: Fill `.env.local`

```bash
cd portfolio
```

Open `.env.local` (or create it from `.env.example`):

```
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SITE_URL=http://localhost:3000
NODE_ENV=development
PORT=3000
```

**Do NOT commit `.env.local` to git** (it contains secrets).

---

## Step 3: Run Database Migrations

### Option A: Supabase Dashboard (easiest for first-time)

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open `supabase/migrations/0001_init.sql` from this repo in a text editor
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **Run** (▶️ button, top right)
7. Wait for success message
8. Repeat steps 2–6 with `0002_rls.sql`

### Option B: Supabase CLI (faster if you run multiple times)

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Link your project
supabase link --project-ref YOUR_PROJECT_ID

# Run migrations
supabase db push
```

**Expected output:** All 28 tables created with triggers and RLS enabled.

---

## Step 4: Seed the Database

Populate with the existing hardcoded content from the React components:

```bash
npm run seed
```

**What this does:**
- Creates 8 pages (home, seo, geo, local, about, portfolio, contact, blog)
- Adds 3 pricing packages per service (SEO, GEO, Local)
- Adds process steps, tools, FAQs, testimonials, brands, portfolio items
- Adds team members, achievements, mission cards
- Adds service options for contact forms
- Adds nav/footer menu structure
- Adds global site settings

**Expected output:**
```
✅ Site settings created
✅ Page created: (home)
✅ Page created: seo
... (one line per entity type)
✅ Seed complete! All data migrated to Supabase.
```

**If seed fails:**
- Check `SUPABASE_SERVICE_ROLE_KEY` is correct (copy-paste, no spaces)
- Make sure migrations ran first (tables must exist in Supabase)
- Check internet connection (seed connects to Supabase)

---

## Step 5: Start the Dev Server

```bash
npm run dev
```

**Expected output:**
```
✅ Server running in development mode
   http://localhost:3000

Public SSR server ready. Connect Supabase at .env to start fetching content.
```

---

## Step 6: Verify SSR is Working

Open a browser or terminal and test:

```bash
# View the home page
curl http://localhost:3000/ | head -50

# View the SEO page
curl http://localhost:3000/seo | head -50

# View sitemap
curl http://localhost:3000/sitemap.xml

# View robots.txt
curl http://localhost:3000/robots.txt
```

**Expected for `/seo`:**
- Starts with `<!DOCTYPE html>`
- Contains `<title>SEO Services In Pakistan...`
- Contains `<meta name="description"`
- Contains actual hero text ("Professional SEO Expert In Pakistan")
- **Does NOT** contain just `<div id="root"></div>` (that would be CSR, not SSR)

---

## Step 7: Test Contact Form

1. Open `http://localhost:3000/contact` in browser
2. Fill out the contact form
3. Submit

**Expected:**
- Form shows "Thank you!" message
- In Supabase dashboard → **contact_submissions** table, new row appears with your data

**Troubleshooting:**
- Check browser DevTools → Network tab → `contact` POST request
- Check terminal output for errors
- Verify rate limit isn't triggered (5 submissions per hour per IP)

---

## Step 8: Browser Inspection

1. Open `http://localhost:3000/seo` in your browser
2. Right-click → **View Page Source** (or press Ctrl+U / Cmd+U)
3. Verify:
   - `<title>` tag is present and correct
   - `<meta name="description">` is present
   - Hero content ("Professional SEO Expert In Pakistan", etc.) is visible in the HTML (not hidden in `<script>`)

If you see:
```html
<div id="root">
  <div>... actual content here ...</div>
</div>
```

✅ **Good!** The server rendered the content and sent it to the browser.

If you see:
```html
<div id="root"></div>
<script type="module" src="/src/entry-client.jsx"></script>
```

❌ **Bad!** The content isn't being rendered on the server. Check:
- Are loaders throwing errors? (check terminal)
- Is Supabase connection string correct?
- Did migrations run?

---

## Step 9: You're Done (Frontend Phase)

The SSR server is live and connected to Supabase. All content is being fetched from the database instead of hardcoded JSX.

**Next steps (for later):**

- [ ] Refactor frontend components to accept data props (currently still hardcoded in JSX)
- [ ] Build admin panel (Next.js app for content editing)
- [ ] Add email notifications for contact forms
- [ ] Deploy to production

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| `Cannot find module 'supabase-js'` | `npm install` is missing deps. Run `npm install` again. |
| `Missing SUPABASE_URL` | Check `.env.local` has the var set. Restart dev server after editing .env. |
| Seed script fails with "relations don't exist" | Migrations didn't run. Go back to Step 3. |
| Seed completes but no data appears | Check Supabase dashboard → Tables. They should exist and have rows. |
| `/seo` page shows 404 | Seed didn't run, or the page slug doesn't match. Check Supabase dashboard → pages table. |
| Contact form doesn't submit | Check `/api/contact` endpoint is being called (DevTools → Network). Check server console for errors. |
| Form submits but no row appears in DB | Check RLS policies are enabled. In Supabase, go to Tables → contact_submissions → RLS. Should be enabled. |
| `renderPage: Supabase error` in terminal | Check service role key is correct. It's different from anon key. |

---

## What's Been Built (and what happens next)

### ✅ Done
- Database schema (28 tables, all RLS-protected)
- Seed script (one-time migration of existing content)
- Express SSR server (renders React to HTML on the server)
- Contact form handler (POST `/api/contact`)
- SEO routes (robots.txt, sitemap.xml, llms.txt, dynamically generated)
- Icon mapping (string → react-icons component lookup)
- Unified ContactForm component (replaces 5 hardcoded duplicates)

### 🚧 TODO (not in scope of this phase, but needed eventually)

- **Frontend refactoring:** Update all `Sections/*` components to accept `data` props instead of importing hardcoded arrays
- **Templates:** Create `SeoTemplate`, `GeoTemplate`, `LocalTemplate` that accept `pageData` prop
- **Admin Panel:** Separate Next.js app for editing pages, blog posts, FAQs, etc.
- **SEO enhancers:** JSON-LD schema generation, Twitter cards, redirect manager
- **Deployment:** Docker, production env setup, DNS routing

---

## Questions?

1. **Supabase docs:** https://supabase.com/docs
2. **Project plan:** See `.claude/plans/rippling-questing-torvalds.md`
3. **Implementation status:** See `IMPLEMENTATION_STATUS.md`
4. **Setup guide:** See `SETUP.md`

Good luck! 🚀
