# Backend + CMS + SSR Setup Guide

This project has been transformed from a pure React SPA to a full-stack system with:
- **Express + Vite SSR** for server-side rendering (SEO-complete)
- **Supabase** for database and content management
- **Admin panel** (Next.js) for content editing
- **Contact form handling** with database storage
- **Dynamic SEO** (meta tags, sitemap, robots.txt, schema markup, OG tags)

---

## Quick Start (Local Development)

### 1. Install Dependencies

```bash
cd portfolio
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials (you'll add these after creating your Supabase project):

```
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SITE_URL=http://localhost:3000
NODE_ENV=development
PORT=3000
```

### 3. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned
3. Copy your **Project URL** and **Anon Key** from Settings → API
4. Copy your **Service Role Key** from Settings → API (keep this secret, server-only)

### 4. Run Migrations & Seed

1. In the Supabase dashboard, go to **SQL Editor**
2. Create a new query and paste the contents of `supabase/migrations/0001_init.sql`
3. Run the query (creates all tables)
4. Create another query and paste `supabase/migrations/0002_rls.sql`
5. Run the query (enables Row Level Security)

Alternatively, use the Supabase CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_ID

# Run migrations
supabase db push
```

### 5. Seed the Database

Populate the database with existing hardcoded content:

```bash
npm run seed
```

This reads the current hardcoded data from the React components and inserts it into Supabase. The site will render identically once wired up.

### 6. Start the Dev Server

```bash
npm run dev
```

The Express + Vite SSR server will start at `http://localhost:3000`

---

## Architecture Overview

```
Client Browser
    ↓
[Express Server] ← Supabase (service role key, server-only)
    ├── /robots.txt (dynamic)
    ├── /sitemap.xml (dynamic)
    ├── /llms.txt (dynamic)
    ├── /api/contact (POST - form handler)
    └── /* (SSR: renders React to HTML)
         ├── Fetches page data (loaders)
         ├── Renders to string
         ├── Injects helmet (meta tags)
         └── Returns HTML

Client-side:
    ├── Hydrates with window.__staticRouterHydrationData__
    ├── Router takes over (no refetch)
    └── Interactions post to /api/contact
```

---

## Key Files & Directories

### Server (Express)

- `server/index.js` — Main Express app (dev: Vite middleware, prod: static + SSR)
- `server/render.js` — SSR render function (React → HTML string)
- `server/seo.js` — Dynamic routes: robots.txt, sitemap.xml, llms.txt
- `server/api/contact.js` — Contact form submission handler

### Source (React)

- `src/entry-client.jsx` — Client hydration entry
- `src/entry-server.jsx` — (Reference) Server render entry
- `src/routes.jsx` — Shared route config (used by both client & server)
- `src/data/loaders.js` — Loaders for fetching page data from Supabase
- `src/lib/supabase.js` — Supabase client setup
- `src/icons/iconMap.js` — String → icon component mapping
- `src/Components/ContactForm/` — Unified contact form (replaces 5 duplicates)

### Database

- `supabase/migrations/0001_init.sql` — Tables, triggers, constraints
- `supabase/migrations/0002_rls.sql` — Row Level Security policies
- `supabase/seed/seed.mjs` — Migrates hardcoded data to Supabase

---

## How Content is Data-Driven

### Before (Hardcoded)

```jsx
const packages = [
  { name: 'Starter', price: '49,999', features: [...] },
  // ... more hardcoded data
];

export default function Seo() {
  return <>packages.map(pkg => <Card {...pkg} /></>;
}
```

### After (Database-Driven)

1. **Data fetched in loader** (server-side):
   ```js
   loader: async () => {
     const page = await loadPageBySlug('seo'); // Fetches from Supabase
     return { pageData: page };
   }
   ```

2. **Serialized to client**:
   ```html
   <script>
     window.__staticRouterHydrationData__ = {
       0: { pageData: { packages: [...], ... } }
     }
   </script>
   ```

3. **Component receives via props**:
   ```jsx
   export default function SeoTemplate({ data }) {
     return <>{data.pricing.map(pkg => <Card {...pkg} />)}</>;
   }
   ```

---

## Admin Panel Setup

The admin panel (for editing pages, content, FAQs, etc.) is a separate Next.js app.

Create a new directory at the same level as `portfolio/`:

```bash
mkdir admin
cd admin
npx create-next-app@latest . --typescript --app
```

See the plan file for admin module details (not built yet — coming next).

---

## Contact Form Flow

1. User fills out form (replaced the 5 hardcoded duplicates with one `<ContactForm>` component)
2. Form POSTs to `/api/contact` (handled by `server/api/contact.js`)
3. Server validates with Zod, rate-limits by IP
4. Inserts into `contact_submissions` table (Supabase)
5. ~~Sends email~~ (skipped per instructions — add email provider later)
6. Returns JSON success/error to client
7. Admin dashboard shows new submissions in "Contact Submissions" module

---

## SEO Features Implemented

### ✅ Done

- [x] SSR (server-side rendering) for all pages
- [x] Dynamic `<title>`, meta description, keywords per page
- [x] Open Graph tags (og:title, og:description, og:image, og:url)
- [x] Canonical URLs
- [x] robots.txt (dynamic, with editable extra rules)
- [x] sitemap.xml (auto-generated from published pages/posts)
- [x] llms.txt (fully editable in admin)
- [x] robots meta tag per page (index/noindex)
- [x] JSON-LD schema builder (ready for Organization/Service/etc.)
- [x] Blog post schema support (BlogPosting)
- [x] Breadcrumb schema support
- [x] 404 page with HTTP 404 status

### 🚧 Next

- [ ] JSON-LD schema generation (scaffolded in loaders, needs builder functions)
- [ ] Twitter Card tags
- [ ] Redirect manager middleware (traffic manager for 301/302 rewrites)
- [ ] Image alt text enforcement (admin upload requires alt text)
- [ ] Core Web Vitals optimization (lazy-load, image compression)
- [ ] Structured breadcrumbs in templates

---

## Database Schema

### Core Tables

- **pages** — Every route: home, seo, geo, local, about, contact, portfolio, blog_index
- **page_hero** — Hero section (heading, CTA, form toggle)
- **page_stats** — Animated stat counters
- **pricing_packages** / **pricing_features** — Service packages
- **process_steps** — "How we work" steps
- **tool_items** — CMS/tools/platforms grids
- **page_scope_cards** — Scope 3-card sections

### Global Content

- **testimonials** / **video_testimonials** — Reviews
- **choose_features** — "Why Choose Me" cards
- **faqs** — FAQ list (page-scoped or global)
- **brands** — Client logos
- **portfolio_items** — Projects & case studies
- **blog_posts** — Blog articles
- **team_members**, **achievements**, **mission_cards** — About page

### Site & Admin

- **site_settings** — Global config (email, phone, social, GA ID, etc.)
- **navbar_menu_items** — Navigation menu
- **footer_columns** / **footer_links** — Footer structure
- **service_options** — Contact form dropdown options
- **contact_submissions** — Form submissions
- **redirects** — 301/302 redirect rules
- **media_library** — Uploaded files (alt text required)
- **profiles** — Admin/editor users

---

## Row Level Security (RLS)

All tables have RLS enabled:

- **Public (anon)**: read-only on published pages/posts/etc., insert-only on contact_submissions
- **Authenticated (admin/editor)**: full CRUD on all tables, gated by role check

The service role key (server-only) bypasses RLS for admin reads.

---

## Scripts

```bash
# Development
npm run dev                 # Start Express + Vite SSR server

# Build
npm run build              # Build client + server bundles for production
npm run build:client       # Build frontend only
npm run build:server       # Build SSR bundle only

# Database
npm run seed               # Migrate hardcoded data to Supabase (one-time)

# Other
npm run lint               # Run ESLint
npm run preview            # Preview production build
```

---

## Deployment Notes (Not Done Yet)

### Public SSR Server

Needs a Node.js host (Render, Railway, Fly.io, etc.):

1. Set `NODE_ENV=production`
2. Set all env vars (Supabase keys, SITE_URL, etc.)
3. Run `npm run build`
4. Run `npm start` (or equivalent for your host)

### Admin Panel

Deploy the separate Next.js app to Vercel (or any Node host).

### Environment Variables

On your host, set:

```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...  (server-only, never expose)
SITE_URL=https://yourdomain.com
NODE_ENV=production
```

---

## Next Steps

1. ✅ Create Supabase project & run migrations
2. ✅ Populate `.env.local` with credentials
3. ✅ Run `npm run seed` to migrate existing data
4. ✅ Test `npm run dev` — visit `http://localhost:3000`
5. View page source to confirm SSR (real `<title>`, content in HTML, not just `<div id="root"></div>`)
6. Build admin panel (Next.js app for content editing)
7. Wire up email notifications (Resend / SMTP)
8. Deploy public SSR server + admin panel

---

## Troubleshooting

### "Missing SUPABASE_URL" error

→ Check `.env.local` has `SUPABASE_URL=...` and `SUPABASE_ANON_KEY=...`

### Seed script fails

→ Make sure migrations ran first (tables exist in Supabase)
→ Check `SUPABASE_SERVICE_ROLE_KEY` is correct (server-only key, not anon key)

### SSR returns blank page

→ Check `server/render.js` is finding the `index.html` template
→ Check console/terminal for errors (likely Supabase loader throwing)

### Contact form not submitting

→ Check `/api/contact` is being called (browser DevTools → Network tab)
→ Check rate limit isn't triggered (5 per hour per IP)
→ Check `contact_submissions` table exists (migrations ran)

---

For questions or issues, check the plan file: `../.claude/plans/rippling-questing-torvalds.md`
