# Page Builder - Quick Start Setup

## Database Setup (2 minutes)

### Step 1: Run the Fixed SQL Migration
The schema file has been updated to handle existing tables/policies safely.

**Copy the entire contents of `PAGE_BUILDER_SCHEMA.sql`** and paste into **Supabase → SQL Editor**

Click Execute. You should see ✅ success (no errors)

If you still get errors:
- The schema is now idempotent (safe to run multiple times)
- Check that you have proper admin access to Supabase
- Verify RLS is enabled on the database

### Step 2: Verify Tables Created
In Supabase, go to **Table Editor** and confirm these tables exist:
- ✅ `pages` (main configuration table)
- ✅ `page_hero` through `page_footer_links` (component data tables)

---

## Application Setup (5 minutes)

### Step 1: Import Components in Your Route Config

Add this to your main router file (e.g., `App.jsx` or `main.jsx`):

```jsx
// Admin Page Builder Routes
import AdminPagesList from './src/Pages/Admin/AdminPagesList';
import AdminPageBuilder from './src/Pages/Admin/AdminPageBuilder';

// Public Page Builder Route
import DynamicPageBuilder from './src/Pages/DynamicPageBuilder';
```

### Step 2: Add Routes

Find your route configuration and add these routes:

```jsx
// Admin: Pages management
{
  path: '/admin/pages',
  element: <AdminPagesList />
}
{
  path: '/admin/pages/new',
  element: <AdminPageBuilder />
}
{
  path: '/admin/pages/:pageId',
  element: <AdminPageBuilder />
}

// Public: View built pages
{
  path: '/page/:slug',
  element: <DynamicPageBuilder />
}
```

### Step 3: Add Navigation Link

Add this to your admin navigation:

```jsx
<Link to="/admin/pages">Pages</Link>
```

---

## Testing (5 minutes)

### Test 1: Admin Interface
1. Start your dev server: `npm run dev`
2. Navigate to `http://localhost:5173/admin/pages`
3. You should see "Pages" interface with "New Page" button
4. ✅ If it loads without errors → Admin UI works

### Test 2: Create a Page
1. Click "New Page"
2. Enter name: `Test Page`
3. Should auto-generate slug: `test-page`
4. You should see 10 components listed
5. Click "Save"
6. ✅ If saved without errors → Database connection works

### Test 3: View Public Page
1. In browser, navigate to `http://localhost:5173/page/test-page`
2. You should see the page render (may show placeholder if components aren't fully wired)
3. ✅ If page loads → Routing works

---

## Common Issues & Fixes

### Issue: "pages_public_read policy already exists"
**Fix:** The schema now uses `DROP POLICY IF EXISTS` to handle this safely. Run the updated SQL file again.

### Issue: Components show but content is empty
**Reason:** Components aren't wired to database yet (data tables are empty)
**Next Step:** This is part of "Next Steps" below

### Issue: Can't see `/admin/pages` route
**Fix:** 
1. Verify you added the routes
2. Check that imports are correct
3. Restart dev server: `npm run dev`

### Issue: Supabase connection errors
**Fix:**
1. Verify `getSupabaseClient()` works in your app
2. Check `.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Test with simple query first

---

## File Checklist ✅

These files should exist in your project:

```
✅ src/lib/componentLibrary.js
✅ src/Pages/Admin/AdminPageBuilder.jsx
✅ src/Pages/Admin/AdminPagesList.jsx
✅ src/Pages/Admin/LayoutSelectorModal.jsx
✅ src/Pages/Admin/PageBuilder.css
✅ src/Pages/DynamicPageBuilder.jsx

📄 PAGE_BUILDER_SCHEMA.sql (run in Supabase)
📄 PAGE_BUILDER_IMPLEMENTATION.md (reference)
📄 ROUTING_UPDATE_EXAMPLE.jsx (example code)
```

---

## What's Working Now ✅

- [x] Admin interface to create/edit pages
- [x] Component layout selection
- [x] Drag-and-drop reordering
- [x] Enable/disable toggle
- [x] Save to database
- [x] Public page routing
- [x] Database schema

## What's Next (Optional) 📋

These are for more complete functionality:

1. **Wire component content** - Load data from component tables
2. **Add content editors** - Forms to edit each component
3. **Add sample data** - Seed database with test content
4. **Link navigation** - Update main site navigation to use new pages

See `PAGE_BUILDER_IMPLEMENTATION.md` for detailed next steps.

---

## File Locations

All created files are in the project root or:
- Admin components: `src/Pages/Admin/`
- Library: `src/lib/componentLibrary.js`
- Public component: `src/Pages/DynamicPageBuilder.jsx`

---

## Support

If you need to reset and start over:

1. Delete all rows from `pages` table
2. Run `PAGE_BUILDER_SCHEMA.sql` again
3. Refresh admin interface

No other cleanup needed - schema handles it all.
