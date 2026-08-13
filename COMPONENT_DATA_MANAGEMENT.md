# Component Data Management Guide

## Overview
Some components require separate data management because they have multiple child items. Here's the complete process for each:

---

## 📋 Components Requiring Separate Data Management

### 1. **SCOPE COMPONENT** - Scope Cards
**Database Tables:**
- `component_scope` - Main component (heading, description)
- `component_scope_cards` - Individual cards (up to 5 cards)

**Fields per Card:**
- `number` - Display number (01, 02, 03...)
- `title` - Card title
- `description` - Card description/text
- `icon_name` - React icon name (e.g., "FaFileAlt")
- `icon_url` - Image URL (alternative to icon_name)
- `sort_order` - Display order

**Add Process:**
1. Fill Scope main heading/description in component form
2. Save component
3. Click "Manage Scope Cards" button
4. Add up to 5 cards with number, title, description
5. Choose icon (from icon picker or image URL)
6. Arrange with drag & drop
7. Save

---

### 2. **PRICING COMPONENT** - Pricing Packages & Features
**Database Tables:**
- `component_pricing` - Main component (heading, description)
- `component_pricing_packages` - Packages (3-4 per page)
- `component_pricing_features` - Features under each package (15-30 per package)

**Package Fields:**
- `name` - Package name (Basic, Standard, Premium)
- `subtitle` - Subtitle (e.g., "Best for Startups")
- `price` - Price amount
- `currency` - Currency (PKR, USD, etc.)
- `billing_period` - Billing period (/Month, /Year, etc.)
- `pages` - Pages covered (e.g., "Upto 10 Pages")
- `is_popular` - Mark as popular/featured
- `sort_order` - Display order

**Feature Fields:**
- `feature_text` - Feature description
- `is_included` - Included (✓) or excluded (✗)
- `sort_order` - Order within package

**Add Process:**
1. Fill Pricing main heading/description
2. Save component
3. Click "Manage Packages"
4. Add Package (3 required minimum):
   - Name, Subtitle, Price, Currency
   - Pages/Locations covered
   - Mark popular if needed
5. For each package, add Features:
   - Click "Add Features" under package
   - Add 15-30 features with checkmark/cross
6. Preview pricing card layout
7. Save all

---

### 3. **PROCESS COMPONENT** - Process Steps
**Database Tables:**
- `component_process` - Main component (heading, description)
- `component_process_steps` - Individual steps (6-8 steps)

**Step Fields:**
- `title` - Step title
- `description` - Step description
- `icon_name` - React icon name
- `icon_url` - Image URL (alternative)
- `step_number` - Step number (1, 2, 3...)
- `sort_order` - Display order

**Add Process:**
1. Fill Process main heading/description
2. Save component
3. Click "Manage Steps"
4. Add 6-8 steps:
   - Title and description
   - Choose icon (icon picker or URL)
   - Auto-numbered (1, 2, 3...)
5. Reorder with drag & drop if needed
6. Save

---

### 4. **FEATURES COMPONENT** - Feature Items
**Database Tables:**
- `component_features` - Main component (heading, description)
- `component_feature_items` - Individual features (8-12 items)

**Feature Item Fields:**
- `title` - Feature title
- `description` - Feature description
- `icon_name` - React icon name
- `icon_url` - Image URL (alternative)
- `sort_order` - Display order

**Add Process:**
1. Fill Features main heading/description
2. Save component
3. Click "Manage Features"
4. Add 8-12 features:
   - Title and description
   - Choose icon (icon picker or URL)
5. Reorder with drag & drop
6. Preview grid layout
7. Save

---

### 5. **TESTIMONIALS COMPONENT** - Testimonial Reviews
**Database Tables:**
- `component_testimonials` - Main component (heading, description)
- `component_testimonial_items` - Individual testimonials (5-10 items)

**Testimonial Fields:**
- `client_name` - Client/Reviewer name
- `client_role` - Client role/company
- `client_image_url` - Avatar/profile image
- `review_text` - Review content (50-200 words)
- `rating` - Star rating (1-5)
- `sort_order` - Display order

**Add Process:**
1. Fill Testimonials main heading/description
2. Save component
3. Click "Manage Testimonials"
4. Add 5-10 testimonials:
   - Client name and role
   - Upload client image
   - Write review text
   - Set star rating (1-5)
5. Reorder with drag & drop
6. Preview testimonial cards
7. Save

---

### 6. **CTA COMPONENT** - Call-to-Action
**Database Tables:**
- `component_cta` - CTA data (single per page)

**CTA Fields:**
- `heading` - Main heading
- `description` - Description text
- `button_text` - Button label
- `button_link` - Button URL
- `background_color` - Background color (hex)
- `text_color` - Text color (hex)

**Add Process:**
1. Fill all CTA fields in component form
2. Preview styling
3. Save

---

### 7. **CONTACT COMPONENT** - Contact Info
**Database Tables:**
- `component_contact` - Contact data

**Contact Fields:**
- `heading` - Section heading
- `description` - Description
- `email` - Email address
- `phone` - Phone number
- `address` - Physical address
- `timezone` - Timezone for local time display

**Add Process:**
1. Fill all contact information
2. Save

---

## 🔄 Admin UI Workflow

### For Page Editor:
```
1. Admin → Pages → Create/Edit Page
2. Select Components (Enable/Disable)
3. Choose Template per Component
4. Fill Basic Component Data
5. For each component needing separate data:
   ├─ Click component name
   ├─ "Manage [Component Name]" appears
   ├─ Add/Edit sub-items
   └─ Save sub-items
6. Publish Page
```

### Quick Add Buttons:
Each component form should have:
- ✏️ Main form (heading, description, etc.)
- ➕ "Manage [Items]" button
  - Opens modal or side panel
  - Lists existing items in table
  - Add/Edit/Delete/Reorder
  - Drag & drop to reorder
  - Save all at once

---

## 📊 Data Flow Diagram

```
Page Created
    ↓
├─ Component: Hero (SEO)
│   └─ Form: Heading, Description, Stats
│   └─ Save to component_hero table
│
├─ Component: Scope (GEO)
│   ├─ Form: Heading, Description
│   └─ Save to component_scope
│   └─ Manage Scope Cards
│       ├─ Card 1: Number, Title, Description, Icon
│       ├─ Card 2: ...
│       └─ Save to component_scope_cards
│
├─ Component: Pricing (LOCAL)
│   ├─ Form: Heading, Description
│   └─ Save to component_pricing
│   └─ Manage Packages
│       ├─ Package 1: Name, Price, Pages
│       │   └─ Manage Features
│       │       ├─ Feature 1: Text, Included
│       │       ├─ Feature 2: ...
│       │       └─ Save to component_pricing_features
│       ├─ Package 2: ...
│       └─ Save to component_pricing_packages
│
└─ Component: Process (SEO)
    ├─ Form: Heading, Description
    └─ Save to component_process
    └─ Manage Steps
        ├─ Step 1: Title, Description, Icon, Order
        ├─ Step 2: ...
        └─ Save to component_process_steps

Page Published
    ↓
Public View renders: Hero → Scope → Pricing → Process
```

---

## 🎯 Implementation Priority

### Phase 1 (Critical):
- ✅ Scope Cards manager
- ✅ Pricing Packages & Features manager
- ✅ Process Steps manager

### Phase 2 (Important):
- ⏳ Features Items manager
- ⏳ Testimonials manager

### Phase 3 (Optional):
- ⏳ Advanced styling options
- ⏳ Bulk import/export

---

## 📝 Form Validation

Each field requires:
- **Title/Heading**: Required, max 255 chars
- **Description**: Required, max 1000 chars
- **Icon Name**: Optional, 2-5 letter code
- **Icon URL**: Optional, valid image URL
- **Price**: Required for pricing, numeric only
- **Order/Sort**: Auto-generated, can be manual

---

## 💾 Save & Publish Flow

```
Component Form
    ↓
[Save Component] → component_hero table
    ↓
[Manage Sub-items] → Modal/Panel
    ↓
Add/Edit/Delete Items
    ↓
[Save Items] → component_*_items table
    ↓
Back to Component Form
    ↓
[Publish Page] → Set status = 'published'
    ↓
Public Page Visible
```

---

## ⚠️ Important Notes

1. **Order Matters**: Use `sort_order` field to control display order
2. **Drag & Drop**: Reordering updates `sort_order` automatically
3. **Icons**: Can use React icon name OR image URL (not both)
4. **Template Match**: Sub-items render based on parent template choice
5. **Cascade Delete**: Deleting component deletes all sub-items automatically
6. **Preview**: Show preview before saving

---

## 🔧 Admin Panel Components to Create

1. **ScopeCardManager.jsx** - Manage scope cards table
2. **PricingManager.jsx** - Manage packages & features
3. **ProcessStepsManager.jsx** - Manage process steps
4. **FeatureItemsManager.jsx** - Manage feature items
5. **TestimonialsManager.jsx** - Manage testimonials
6. **ItemReorderModal.jsx** - Reusable modal for drag & drop reordering
7. **IconPicker.jsx** - Reusable icon selector

---

## Example: Adding Scope Cards (Step by Step)

### User Action:
1. Admin → Pages → Edit "My SEO Page"
2. Select Component: Scope (GEO)
3. Fill: Heading = "Scope Of GEO", Description = "..."
4. **Click Button: "Manage Scope Cards"**

### Modal Opens:
```
┌─ Manage Scope Cards ──────────────┐
├─ Existing Cards:                   │
│ ☰ 01 | Audit | [Edit] [Delete]   │
│ ☰ 02 | Optimization | [Edit] [Del]│
│ ☰ 03 | Visibility | [Edit] [Del]  │
├─────────────────────────────────────│
│ [+ Add New Card]                    │
└─────────────────────────────────────┘
```

### Click "Edit" on Card 1:
```
┌─ Edit Card ──────────────┐
├─ Number: 01              │
├─ Title: [Audit]          │
├─ Description: [text...]  │
├─ Icon: [Icon Picker ⭐]  │
├─ or Image: [Upload URL]  │
├─ [Save] [Cancel]         │
└──────────────────────────┘
```

### Save & Back to Modal:
- Card updated in `component_scope_cards` table
- Modal refreshes with updated card
- Changes immediately visible in preview

### Click "Save" on Modal:
- All cards saved (if batch edit)
- Modal closes
- Component form shows updated card count
- User can now publish page

---

