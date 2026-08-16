# 📋 Services Management System — Complete Guide

## Overview

A complete **admin-controlled services management system** where:
- ✅ Admin creates/edits services in database
- ✅ Admin decides which services show on homepage (featured)
- ✅ Admin decides which services appear in navbar dropdown
- ✅ "Show All Services" page displays all active services
- ✅ Services can be reordered via drag-and-drop

---

## 🎯 Features

### **Service Properties**
Each service has:
- **Title** — Service name (e.g., "SEO Services")
- **Description** — Short explanation
- **Icon** — Emoji or custom image
- **Page URL** — Link destination (e.g., `/seo`)
- **Show on Homepage** — Toggle to feature on homepage
- **Show in Navbar** — Toggle to include in Services dropdown
- **Active/Inactive** — Hide service without deleting

---

## 🔧 How to Manage Services

### **Step 1: Access Services Manager**
```
Admin Panel → Click "Services" in left sidebar
```

### **Step 2: Add New Service**
Click **"+ Add Service"** button

Fill in:
| Field | Example | Required |
|-------|---------|----------|
| **Title** | Web Development | Yes |
| **Description** | Custom web solutions for your business | No |
| **Icon (emoji)** | 🌐 | No |
| **Icon (custom image)** | upload or paste URL | No |
| **Page URL** | /web-dev | Yes |
| **Show on Homepage** | ✓ Checked | No |
| **Show in Navbar** | ✓ Checked | No |

### **Step 3: Edit Service**
Click **✏️ Edit** button to modify any service

### **Step 4: Control Homepage Display**
- Click **📱 Homepage** button to toggle
- **BLUE** = Shows on homepage
- **GRAY** = Hidden from homepage
- Homepage shows max **3 featured services** (first 3 in order)

### **Step 5: Control Navbar Display**
- Click **🔗 Navbar** button to toggle
- **BLUE** = Shows in navbar Services dropdown
- **GRAY** = Hidden from navbar
- All navbar services display in dropdown

### **Step 6: Reorder Services**
- Grab **⋮⋮ Drag Handle** on left
- Drag to new position
- Saves automatically

### **Step 7: Delete Service**
- Click **🗑️ Trash** button
- Confirm deletion

---

## 📍 Where Services Display

### **1. Homepage (`/`)**
```
┌─────────────────────┐
│   Our Services      │
├─────────────────────┤
│ [Icon] Service 1    │
│ [Icon] Service 2    │
│ [Icon] Service 3    │
│                     │
│ [View All Services] │
└─────────────────────┘
```
- Shows **top 3** featured services (by sort order)
- Only if `show_on_homepage = true`
- "View All Services" link appears if more than 3 services

### **2. Navbar Dropdown**
```
📱 Main Menu
├── Home
├── About
├── Services ▼
│   ├── Service A      (if show_in_navbar = true)
│   ├── Service B      (if show_in_navbar = true)
│   └── Service C      (if show_in_navbar = true)
├── Portfolio
└── Contact
```
- Services appear in **Services dropdown**
- Only if `show_in_navbar = true`
- Ordered by `sort_order`
- Replaces hardcoded SEO/GEO/Local links

### **3. Show All Services (`/services`)**
```
┌──────────────────────────────────────┐
│        All Services Page             │
├──────────────────────────────────────┤
│  [Icon] Service 1    [Featured]     │
│  [Icon] Service 2    [In Menu]      │
│  [Icon] Service 3                   │
│  [Icon] Service 4    [Featured]     │
│  ...                                │
└──────────────────────────────────────┘
```
- Shows **ALL active services**
- Displays badges:
  - 🟡 **Featured** = Shows on homepage
  - 🔵 **In Menu** = Shows in navbar
- Sorted by `sort_order`

---

## 🗄️ Database Schema

```sql
CREATE TABLE services (
  id UUID PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),                    -- Emoji
  icon_url TEXT,                       -- Custom image URL
  page_url VARCHAR(255),               -- /seo, /web-dev, etc
  show_on_homepage BOOLEAN DEFAULT true,
  show_in_navbar BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,        -- Display order
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

---

## 📊 Example Service Structure

**Homepage Setup:**
```
Service 1: SEO Services      → show_on_homepage: ✓ / sort: 0
Service 2: Web Development   → show_on_homepage: ✓ / sort: 1
Service 3: Branding          → show_on_homepage: ✓ / sort: 2
Service 4: Content Writing   → show_on_homepage: ✗ / sort: 3
Service 5: SMM               → show_on_homepage: ✗ / sort: 4
```

**Result:**
- Homepage shows: SEO, Web Dev, Branding
- "View All Services" shows all 5
- Navbar dropdown shows all 5

**Navbar Setup:**
```
Service 1: SEO Services      → show_in_navbar: ✓
Service 2: Web Development   → show_in_navbar: ✓
Service 3: Branding          → show_in_navbar: ✓
Service 4: Content Writing   → show_in_navbar: ✗
Service 5: SMM               → show_in_navbar: ✓
```

**Result:**
- Navbar dropdown shows: SEO, Web Dev, Branding, SMM (not Content Writing)

---

## 🔄 Icon Options (Priority Order)

1. **Custom Image** (`icon_url`) — Upload or paste URL
   - Best for logos and branded icons
   - Supports PNG, JPG, SVG
2. **Emoji** (`icon`) — Single character
   - Quick and colorful
   - Fallback if no custom image

**Example:**
- Service has `icon_url: "https://...logo.png"` → Shows custom logo
- Service has only `icon: "🔍"` → Shows emoji

---

## 🛠️ API Functions

The system uses these fetch functions:

```javascript
// Fetch featured services for homepage (first 3)
fetchHomepageServices()
// Returns: [{id, title, description, icon, icon_url, page_url, ...}]

// Fetch services for navbar dropdown
fetchNavbarServices()
// Returns: [services with show_in_navbar: true]

// Fetch all services (admin only)
fetchServices(onlyActive = false)
// Returns: [all services]
```

---

## 📁 Files & Locations

### **Components**
- `src/Sections/Services/HomepageServices.jsx` — Homepage services display
- `src/Sections/Services/HomepageServices.css`
- `src/Pages/Services/AllServices.jsx` — Full services page
- `src/Pages/Services/AllServices.css`

### **Admin Manager**
- `src/Pages/Admin/ServicesManager.jsx` — Admin UI for managing services

### **Database**
- `sql/SERVICES_SCHEMA.sql` — Schema and sample data

### **Routes**
- `/services` — Show all services page
- `/admin/services-manager` — Admin management panel

---

## 🚀 Initial Setup

### **1. Create Database Table**
Run this SQL in Supabase:
```sql
-- Copy contents of: sql/SERVICES_SCHEMA.sql
-- Paste into Supabase SQL editor
-- Executes sample services (SEO, GEO, Local SEO)
```

### **2. Access Admin Panel**
```
http://localhost:5173/admin
→ Click "Services" in sidebar
```

### **3. Manage Services**
- Edit existing 3 services
- Add new services
- Toggle show_on_homepage / show_in_navbar
- Reorder via drag-drop

### **4. View on Frontend**
- Homepage shows featured services
- Navbar dropdown shows selected services
- `/services` shows all active services

---

## 💡 Common Tasks

### **Add New Service**
1. Click "+ Add Service"
2. Fill in title, description, page URL
3. Click "📱 Homepage" to add to homepage
4. Click "🔗 Navbar" to add to navbar
5. Save

### **Hide Service from Homepage**
1. Find service
2. Click "📱 Homepage" (turn gray)
3. Auto-saves

### **Hide Service from Navbar**
1. Find service
2. Click "🔗 Navbar" (turn gray)
3. Auto-saves

### **Delete Service**
1. Find service
2. Click "🗑️ Trash"
3. Confirm

### **Reorder Services**
1. Grab "⋮⋮" handle
2. Drag to new position
3. Auto-saves (affects homepage order and navbar order)

### **Add Custom Icon**
1. Edit service
2. Paste icon URL or upload file
3. See preview immediately
4. Save

---

## ✅ Production Checklist

- [ ] Database schema created (`SERVICES_SCHEMA.sql`)
- [ ] 3 sample services seeded
- [ ] ServicesManager accessible in admin panel
- [ ] HomepageServices component shows on homepage
- [ ] AllServices page accessible at `/services`
- [ ] Navbar dropdown loads services dynamically
- [ ] Icons (emoji + custom) display correctly
- [ ] Drag-drop reordering works
- [ ] Homepage shows max 3 featured services
- [ ] "View All Services" link appears on homepage

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Services not showing on homepage | Check `show_on_homepage = true` and `is_active = true` |
| Services not in navbar dropdown | Check `show_in_navbar = true` |
| Icons not displaying | Verify `icon_url` is valid URL or `icon` has emoji |
| Drag-drop not working | Check sort_order in database updates |
| Admin page 404 | Verify route `/admin/services-manager` in main.jsx |

---

That's it! 🎉 Your services are now fully managed via admin panel without any code changes needed.
