# Page Builder System - Visual Architecture Guide

## 🏗️ Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        ADMIN PANEL                               │
│                   /admin/pages                                   │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Settings   │  │  Components  │  │ Properties   │          │
│  │   Panel      │  │   Panel      │  │   Panel      │          │
│  │              │  │              │  │              │          │
│  │ • Page Name  │  │ • Header     │  │ • Component  │          │
│  │ • Page Slug  │  │ • Hero       │  │   Details    │          │
│  │ • Status     │  │ • Services   │  │ • Layout     │          │
│  │              │  │ • Pricing    │  │   Selector   │          │
│  │ [Save] [Pub] │  │ • Process    │  │ • Toggle     │          │
│  │              │  │ • Features   │  │   Enable/Off │          │
│  │              │  │ • Testimonals│  │              │          │
│  │              │  │ • CTA        │  │ [Change]     │          │
│  │              │  │ • Footer     │  │ [Enable/Off] │          │
│  │              │  │              │  │              │          │
│  │              │  │ [Drag ⟷]     │  │              │          │
│  │              │  │ [Change]     │  │              │          │
│  │              │  │ [Toggle]     │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                    [Save to Database]
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE DATABASE                           │
│                                                                  │
│  pages table:                                                   │
│  ┌────────┬──────────┬────────┬──────────────────┐             │
│  │   id   │   name   │ status │ layout_config    │             │
│  ├────────┼──────────┼────────┼──────────────────┤             │
│  │ uuid-1 │ My Page  │ draft  │ {components: []} │             │
│  └────────┴──────────┴────────┴──────────────────┘             │
│                                                                  │
│  layout_config (JSONB):                                         │
│  {                                                              │
│    "components": [                                             │
│      { "id": "header", "layout": 1, "enabled": true },         │
│      { "id": "hero", "layout": 2, "enabled": true },           │
│      { "id": "services", "layout": 3, "enabled": true },       │
│      { "id": "pricing", "layout": 1, "enabled": false },       │
│      ...                                                        │
│    ]                                                            │
│  }                                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                    [Read Configuration]
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    PUBLIC PAGE RENDERER                          │
│                   /page/:slug                                    │
│                                                                  │
│  DynamicPageBuilder.jsx                                        │
│  - Fetches page by slug                                        │
│  - Reads layout_config                                         │
│  - Iterates through components                                 │
│  - For each enabled component:                                 │
│    • Gets Component class from COMPONENT_MAP                   │
│    • Renders with selected layout                              │
│    • Passes data from database                                 │
│                                                                  │
│  Rendered Output:                                              │
│  ┌────────────────────────────────────────┐                   │
│  │          Header (Layout 1)             │                   │
│  ├────────────────────────────────────────┤                   │
│  │          Hero (Layout 2)               │                   │
│  ├────────────────────────────────────────┤                   │
│  │          Services (Layout 3)           │                   │
│  ├────────────────────────────────────────┤                   │
│  │          (Pricing disabled - hidden)   │                   │
│  ├────────────────────────────────────────┤                   │
│  │          Footer (Layout 1)             │                   │
│  └────────────────────────────────────────┘                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                      USER VIEWS PAGE
```

---

## 🔄 Data Flow Diagram

```
Admin Input
    ↓
    ├─ Page Name: "My Services"
    ├─ Page Slug: "my-services"
    ├─ Status: "Published"
    └─ Layout Config:
        ├─ Header: Layout 1 (SEO)
        ├─ Hero: Layout 2 (GEO)
        ├─ Services: Layout 3 (Local)
        ├─ Pricing: DISABLED
        ├─ Process: Layout 1 (SEO)
        ├─ Features: Layout 2 (GEO)
        ├─ Testimonials: Layout 1 (SEO)
        └─ Footer: Layout 3 (Local)
    ↓
    [Save to Database]
    ↓
    pages table:
    {
      id: "abc123",
      name: "My Services",
      slug: "my-services",
      status: "published",
      layout_config: {...}
    }
    ↓
    User visits /page/my-services
    ↓
    DynamicPageBuilder fetches page
    ↓
    For each component in layout_config:
    ├─ Get component from COMPONENT_MAP
    ├─ Render with selected layout
    └─ Insert into page
    ↓
    Page renders with mixed components
    ↓
    User sees complete page
```

---

## 🗂️ Component Mapping

```
COMPONENT_MAP (in DynamicPageBuilder.jsx):

header → {
  1: SeoHeader,
  2: GeoHeader,
  3: LocalHeader
}

hero → {
  1: SeoHero,
  2: GeoHero,
  3: LocalHero
}

services → {
  1: SeoScope,
  2: GeoScope,
  3: LocalScope
}

pricing → {
  1: SeoPricing,
  2: GeoPricing,
  3: LocalPricing
}

process → {
  1: SeoProcess,
  2: GeoProcess,
  3: LocalProcess
}

features → {
  1: SeoFeatures,
  2: GeoBenefits,
  3: SeoFeatures
}

testimonials → {
  1: Testimonials,
  2: Testimonials,
  3: Testimonials
}

cta → {
  1: Contact,
  2: Contact,
  3: Contact
}

footer → {
  1: Footer,
  2: Footer,
  3: Footer
}

(+ about component)
```

---

## 📱 Admin UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ Back  │ Create New Page         │ Preview  │ Save & Publish      │
├───────────────────────────────────────────────────────────────────┤
│      │                         │                  │                │
│ PAGE │                         │  PAGE STRUCTURE  │  PROPERTIES    │
│ NAME │                         │                  │                │
│      │    COMPONENTS PANEL     │                  │                │
│ SLUG │                         │  01 Header       │  Details for   │
│      │  01 Header        [⟶]   │      SEO         │  selected      │
│ STAS │  02 Hero          [⟶]   │  02 Hero         │  component     │
│      │  03 About         [⟶]   │      GEO         │                │
│ [SA] │  04 Services      [⟶]   │  03 About        │  [Change Layout]
│      │  05 Pricing       [⟶]   │      ✓ ENABLED   │  [Enable/Off]  │
│      │  06 Process       [⟶]   │  04 Services     │                │
│      │  07 Features      [⟶]   │      Local       │                │
│      │  08 Testimonals   [⟶]   │  05 Pricing      │                │
│      │  09 CTA           [⟶]   │      ✗ DISABLED  │                │
│      │  10 Footer        [⟶]   │  06 Process      │                │
│      │                         │      SEO         │                │
│      │                         │                  │                │
│      │                         │  ... more        │                │
│      │                         │                  │                │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔀 Component Selection Flow

```
Admin clicks "Change" on a component
    ↓
LayoutSelectorModal opens
    ↓
Shows 3 cards:
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Layout 1        │  │  Layout 2 ✓      │  │  Layout 3        │
│  (SEO Template)  │  │  (GEO Template)  │  │  (Local Template)│
│                  │  │  [SELECTED]      │  │                  │
│  Description...  │  │  [Currently set] │  │  Description...  │
│                  │  │                  │  │                  │
│  [Select]        │  │  [✓ Selected]    │  │  [Select]        │
└──────────────────┘  └──────────────────┘  └──────────────────┘
                            ↓
                    Admin clicks "Select"
                            ↓
                    Modal closes
                            ↓
                    Component updates to Layout 2
                            ↓
                    Preview updates instantly
                            ↓
                    Save button activates
```

---

## 🗃️ Database Table Relationships

```
pages (main configuration)
├── id (UUID)
├── name
├── slug
├── status
├── layout_config (JSONB - stores component selections)
└── metadata (meta_title, meta_description, etc.)

page_hero (component data)
├── page_id (FK → pages)
├── heading
├── subheading
└── ...

page_scope (component data)
├── page_id (FK → pages)
├── heading
└── ... scope_cards

page_pricing (component data)
├── page_id (FK → pages)
├── ... pricing_packages
    └── ... pricing_features

page_process (component data)
├── page_id (FK → pages)
└── ... process_steps

page_features (component data)
├── page_id (FK → pages)
└── ... feature_items

page_testimonials (component data)
├── page_id (FK → pages)
└── ... testimonial_items

page_cta (component data)
├── page_id (FK → pages)
└── ...

page_footer (component data)
├── page_id (FK → pages)
└── ... footer_links
```

---

## 🎯 Feature Matrix

```
                  Admin  │  Public  │  Database
────────────────────────┼──────────┼──────────
Create Page               Yes   │   No    │  Yes
Edit Page                 Yes   │   No    │  Yes
Delete Page               Yes   │   No    │  Yes
Change Component Layout   Yes   │   No    │  Yes
Enable/Disable Component  Yes   │   No    │  Yes
Reorder Components        Yes   │   No    │  Yes
Save Configuration        Yes   │   No    │  Yes
View Published Pages      No    │  Yes    │  Yes
View Page Config          Yes   │   No    │  Yes
Edit Component Content    No*   │   No    │  Future
────────────────────────────────────────────────

* Planned for Phase 2
```

---

## 🚀 Deployment Path

```
Local Development
    ↓
Run Schema Migration
    ↓
Update Routes
    ↓
Add Navigation
    ↓
Local Testing (Admin & Public)
    ↓
Create Test Pages
    ↓
Verify All Features
    ↓
Ready for Production
    ↓
Deploy to Server
    ↓
Create Production Pages
    ↓
Update Navigation Links
    ↓
Deprecate Old Service System
    ↓
Monitor & Maintain
```

---

## 📊 Configuration Examples

### Example 1: All SEO
```json
{
  "components": [
    {"id": "header", "layout": 1, "enabled": true},
    {"id": "hero", "layout": 1, "enabled": true},
    {"id": "services", "layout": 1, "enabled": true},
    {"id": "pricing", "layout": 1, "enabled": true},
    {"id": "process", "layout": 1, "enabled": true},
    {"id": "features", "layout": 1, "enabled": true},
    {"id": "testimonials", "layout": 1, "enabled": true},
    {"id": "cta", "layout": 1, "enabled": true},
    {"id": "footer", "layout": 1, "enabled": true}
  ]
}
```

### Example 2: Mixed Templates
```json
{
  "components": [
    {"id": "header", "layout": 1, "enabled": true},
    {"id": "hero", "layout": 2, "enabled": true},
    {"id": "services", "layout": 3, "enabled": true},
    {"id": "pricing", "layout": 1, "enabled": true},
    {"id": "process", "layout": 2, "enabled": false},
    {"id": "features", "layout": 3, "enabled": true},
    {"id": "testimonials", "layout": 1, "enabled": true},
    {"id": "cta", "layout": 2, "enabled": true},
    {"id": "footer", "layout": 3, "enabled": true}
  ]
}
```

### Example 3: Minimal
```json
{
  "components": [
    {"id": "header", "layout": 1, "enabled": true},
    {"id": "hero", "layout": 2, "enabled": true},
    {"id": "cta", "layout": 1, "enabled": true},
    {"id": "footer", "layout": 3, "enabled": true}
  ]
}
```

---

## 🔐 Security Architecture

```
Public Internet
    ↓
Supabase RLS
├─ Published pages: Read-only for all
├─ Draft pages: Authenticated users only
├─ Component data: Follow parent page rules
└─ Admin operations: Admin role only
    ↓
Application Layer
├─ AdminPageBuilder: Route guard (if needed)
├─ DynamicPageBuilder: Filters draft pages
└─ AdminPagesList: Shows all to authenticated users
    ↓
Database Policies
├─ SELECT on pages: status='published' OR authenticated
├─ INSERT/UPDATE/DELETE: authenticated role only
└─ Component tables: Follow parent pages rules
```

---

**Visual Architecture Complete!** 

This guide shows how all pieces fit together. Refer to specific parts when building or debugging.
