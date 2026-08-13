# Page Builder Implementation Guide

## Overview
The Page Builder system replaces the old service creation mechanism by allowing users to mix components from 3 templates (SEO, GEO, Local) and create custom pages with independent component selection.

## Files Created

### 1. **Core Components**
- `src/lib/componentLibrary.js` - Maps 10 components to 3 layout variants
- `src/Pages/Admin/AdminPageBuilder.jsx` - Main Page Builder interface (create/edit pages)
- `src/Pages/Admin/AdminPagesList.jsx` - List of all pages with management options
- `src/Pages/Admin/LayoutSelectorModal.jsx` - Modal for selecting component layouts
- `src/Pages/Admin/PageBuilder.css` - Complete styling for Page Builder UI
- `src/Pages/DynamicPageBuilder.jsx` - Public page renderer (displays built pages)

### 2. **Database Schema**
- `PAGE_BUILDER_SCHEMA.sql` - Complete database schema with all required tables

## Integration Steps

### Step 1: Run Database Migration
```sql
-- Run this in your Supabase SQL editor
-- It creates the pages table and all component data tables
```

Copy the contents of `PAGE_BUILDER_SCHEMA.sql` and run it in your Supabase dashboard under SQL Editor.

### Step 2: Update Router

Add these routes to your `src/App.jsx` or routing configuration:

```jsx
import AdminPagesList from './Pages/Admin/AdminPagesList';
import AdminPageBuilder from './Pages/Admin/AdminPageBuilder';
import DynamicPageBuilder from './Pages/DynamicPageBuilder';

// In your route configuration, add:

// Admin Routes
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

// Public Routes
{
  path: '/page/:slug',
  element: <DynamicPageBuilder />
}
```

### Step 3: Add Admin Navigation Link

Update your admin navigation to include a link to `/admin/pages`:

```jsx
<nav>
  {/* ... existing links ... */}
  <Link to="/admin/pages">Pages</Link>
</nav>
```

## How It Works

### For Admins (Creating Pages)

1. **Go to Admin → Pages**
   - See all created pages
   - Create new page or edit existing

2. **Create New Page**
   - Enter page name (auto-generates slug)
   - Page structure shows 10 default components
   - Left panel: Components list with drag-to-reorder
   - Center panel: Page structure preview
   - Right panel: Component details and properties

3. **Customize Components**
   - Click "Change" button on any component
   - Modal shows 3 layout options (SEO, GEO, Local)
   - Select desired layout for that component
   - Toggle component on/off with checkbox

4. **Save Page**
   - Click "Save" to save as draft
   - Change status to "Published" when ready
   - Published pages are live and accessible

### For Users (Viewing Pages)

- Visit `/page/your-page-slug` to view the custom page
- Page renders with selected component variants in order
- Only enabled components are displayed

## Component Structure

### 10 Available Components

1. **Header** - Navigation header
2. **Hero** - Hero section with CTA
3. **About** - About/introduction section
4. **Services** - Services/scope section
5. **Pricing** - Pricing packages section
6. **Process** - Process/workflow section
7. **Features** - Features/benefits section
8. **Testimonials** - Testimonials/reviews section
9. **CTA** - Call-to-action section
10. **Footer** - Page footer

### 3 Layout Variants per Component

- **Layout 1**: SEO Template variant
- **Layout 2**: GEO Template variant
- **Layout 3**: Local Template variant

## Component Data Management

Each component type has its own data table:

- `page_hero` - Hero section content
- `page_scope` + `page_scope_cards` - Services/scope content
- `page_pricing` + `page_pricing_packages` + `page_pricing_features` - Pricing content
- `page_process` + `page_process_steps` - Process content
- `page_features` + `page_feature_items` - Features content
- `page_testimonials` + `page_testimonial_items` - Testimonials content
- `page_cta` - CTA content
- `page_footer` + `page_footer_links` - Footer content

## Storage Format

Page configuration is stored as JSONB in the `pages.layout_config` field:

```json
{
  "components": [
    {
      "id": "header",
      "name": "Header",
      "layout": 1,
      "enabled": true,
      "order": 0
    },
    {
      "id": "hero",
      "name": "Hero",
      "layout": 2,
      "enabled": true,
      "order": 1
    },
    {
      "id": "footer",
      "name": "Footer",
      "layout": 3,
      "enabled": true,
      "order": 9
    }
  ]
}
```

## Next Steps

### Immediate (Required)
1. ✅ Run `PAGE_BUILDER_SCHEMA.sql` migration
2. ✅ Update router with new routes
3. ✅ Add admin navigation link
4. ✅ Test creating/editing pages in admin

### Near Term (Important)
1. **Extract Component Variants** - Currently using placeholder components; extract actual sections from Geo.jsx, Seo.jsx, Local.jsx into separate component files
2. **Wire Component Content** - Create loaders to fetch component-specific data from database
3. **Add Content Editors** - Build admin forms to edit each component's content
4. **Live Preview** - Implement live preview in page builder

### Future (Nice to Have)
1. Template presets (auto-populate with recommended component selection)
2. Version history for pages
3. Page analytics
4. SEO analyzer
5. A/B testing variants

## Troubleshooting

### Components Not Rendering
- Check that `DynamicPageBuilder.jsx` imports match your actual component file names
- Verify `COMPONENT_MAP` in `DynamicPageBuilder.jsx` has entries for all components

### Page Not Found
- Verify page slug is correct
- Check page status is "published"
- Make sure RLS policies allow public read for published pages

### Layout Changes Not Saving
- Check browser console for API errors
- Verify Supabase credentials are correct
- Ensure `pages` table exists and is accessible

## API Endpoints

### Page CRUD Operations

```
GET /api/pages
- Fetch all published pages

GET /api/pages/:slug
- Fetch page by slug

POST /admin/api/pages
- Create new page (admin only)

PATCH /admin/api/pages/:id
- Update page (admin only)

DELETE /admin/api/pages/:id
- Delete page (admin only)
```

## Database Structure Summary

```sql
pages (id, name, slug, status, layout_config, created_at, updated_at)
├── page_hero
├── page_scope
│   └── page_scope_cards
├── page_pricing
│   └── page_pricing_packages
│       └── page_pricing_features
├── page_process
│   └── page_process_steps
├── page_features
│   └── page_feature_items
├── page_testimonials
│   └── page_testimonial_items
├── page_cta
└── page_footer
    └── page_footer_links
```

## Testing Checklist

- [ ] Database migration runs without errors
- [ ] Admin can navigate to `/admin/pages`
- [ ] Can create new page with all 10 components
- [ ] Can change component layout
- [ ] Can toggle components on/off
- [ ] Can reorder components via drag-drop
- [ ] Can save page as draft
- [ ] Can publish page
- [ ] Published page is accessible at `/page/slug`
- [ ] Page renders with correct component variants
- [ ] Only enabled components show on public page
