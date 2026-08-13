# ⚡ QUICK REFERENCE - PAGE BUILDER

## 🎯 HOW TO ADD SCOPE CARDS (3 Steps)

### **Step 1: Enable Scope Component**
```
Admin → Pages → Edit Page
↓
Enable: ☑️ Scope (GEO)
Choose Template: [GEO ▼]
```

### **Step 2: Click Manage Button**
```
In SCOPE form, click:
[📝 Manage Scope Cards]

A modal opens showing existing cards
```

### **Step 3: Add Cards**
```
Click [+ Add New Card]

Fill in:
- Number: 01
- Title: Audit
- Description: Analyze current state...
- Icon: FaFileAlt (or image URL)

Click [Save Card]

Repeat for all cards (3-5 typical)
```

**Done! ✓** Cards saved to database

---

## 🎯 HOW TO ADD PRICING PACKAGES (5 Steps)

### **Step 1: Enable Pricing Component**
```
Admin → Pages → Edit Page
↓
Enable: ☑️ Pricing (LOCAL)
Choose Template: [LOCAL ▼]
```

### **Step 2: Click Manage Button**
```
In PRICING form, click:
[💰 Manage Pricing Packages]

A modal opens showing existing packages
```

### **Step 3: Add Package**
```
Click [+ Add New Package]

Fill in:
- Name: Basic
- Subtitle: Best for Startups
- Price: 59999
- Currency: PKR
- Billing: /Month
- Pages: Upto 10 Pages
- Popular: ☑ (if featured)

Click [Save Package]
```

### **Step 4: Add Features**
```
Click [+ Add Feature] under package

Type feature text:
"Setup Google Search Console"

Check if included: ☑

Add 20-30 features per package
```

### **Step 5: Save Features**
```
Click [Save Features]

Repeat for all packages (3-4 typical)
```

**Done! ✓** Packages & features saved to database

---

## 🎯 HOW TO ADD PROCESS STEPS (3 Steps)

### **Step 1: Enable Process Component**
```
Admin → Pages → Edit Page
↓
Enable: ☑️ Process (SEO)
Choose Template: [SEO ▼]
```

### **Step 2: Click Manage Button**
```
In PROCESS form, click:
[🔄 Manage Process Steps]

A modal opens showing existing steps
```

### **Step 3: Add Steps**
```
Click [+ Add New Step]

Fill in:
- Step #: Auto-numbered (1, 2, 3...)
- Title: Website Audit
- Description: Analyze the website...
- Icon: FaFileAlt (or image URL)

Click [Save Step]

Repeat for all steps (6-8 typical)

To reorder:
- Drag ☰ icon up/down
- Step numbers auto-update
```

**Done! ✓** Steps saved to database

---

## 📊 COMPONENT TYPES SUMMARY

| Component | Type | Separate Manager | Add Via |
|-----------|------|---|---|
| **Hero** | Basic | No | Form fields |
| **Scope** | Complex | YES ✓ | ScopeCardManager |
| **Pricing** | Complex | YES ✓ | PricingManager |
| **Process** | Complex | YES ✓ | ProcessStepsManager |
| **Features** | Complex | Coming | Soon |
| **Testimonials** | Complex | Coming | Soon |
| **CTA** | Basic | No | Form fields |
| **Contact** | Basic | No | Form fields |
| **About** | Basic | No | Form fields |

---

## 🚀 FULL PAGE CREATION (30 min)

```
1. Admin → Pages → Create New Page (2 min)
   └─ Name: "My Services"
   └─ Slug: "my-services"
   └─ Status: Draft

2. Select Components (1 min)
   ☑️ Hero (GEO)
   ☑️ Scope (GEO)
   ☑️ Pricing (LOCAL)
   ☑️ Process (SEO)

3. Fill Hero (2 min)
   └─ [Save Hero]

4. Fill Scope (2 min)
   └─ [📝 Manage Scope Cards]
      └─ Add 3 cards
      └─ [✕] Close
   └─ [Save Scope]

5. Fill Pricing (10 min)
   └─ [💰 Manage Pricing Packages]
      └─ Add 3 packages
      └─ Add 20-30 features per package
      └─ [✕] Close
   └─ [Save Pricing]

6. Fill Process (5 min)
   └─ [🔄 Manage Process Steps]
      └─ Add 8 steps
      └─ [✕] Close
   └─ [Save Process]

7. Publish (1 min)
   └─ [Publish Page]
   └─ ✓ Live at /my-services
```

---

## 🎯 COMMON TASKS

### **Edit Existing Page**
```
Admin → Pages → [Your Page] → [Edit]
↓
Make changes
↓
[Publish] (auto-updates)
```

### **Add More Cards/Packages/Steps**
```
While editing page:
[📝 Manage Scope Cards] (etc.)
↓
[+ Add New Card] (etc.)
↓
Fill details
↓
[Save Card] (etc.)
```

### **Delete Items**
```
In manager modal:
[Delete] button on each item
↓
Confirm deletion
↓
Item removed from database
```

### **Reorder Items**
```
In manager modal:
Click & drag ☰ icon
↓
Drop in new position
↓
Order auto-saves
```

---

## ⚙️ TECHNICAL DETAILS

### **Database Tables Created**
```
component_scope
└─ component_scope_cards (sub-items)

component_pricing
├─ component_pricing_packages (sub-items)
└─ component_pricing_features (sub-sub-items)

component_process
└─ component_process_steps (sub-items)
```

### **Manager Components**
```
src/Pages/Admin/
├─ ScopeCardManager.jsx (200 lines)
├─ PricingManager.jsx (350 lines)
├─ ProcessStepsManager.jsx (230 lines)
└─ ItemManager.css (400 lines)
```

### **Public Rendering**
```
src/lib/componentExtractor.jsx
└─ COMPONENT_RENDERER_MAP
   ├─ Hero: SeoHero, GeoHero, LocalHero
   ├─ Scope: SeoScope, GeoScope, LocalScope
   ├─ Pricing: SeoPricing, GeoPricing, LocalPricing
   └─ Process: SeoProcess, GeoProcess, LocalProcess
```

---

## 📖 DOCUMENTATION

| File | Purpose | Users |
|------|---------|-------|
| **HOW_TO_USE_PAGE_BUILDER.md** | Complete guide with visuals | Everyone |
| **COMPONENT_DATA_MANAGEMENT.md** | What needs separate management | Developers |
| **QUICK_REFERENCE.md** | This file! Quick lookup | Everyone |

---

## 🆘 HELP

**"Where's the manage button?"**
→ Enable the component in "Select Components" first

**"Can't save items?"**
→ Check browser console for errors
→ Make sure all required fields filled

**"Changes not showing?"**
→ Refresh public page (Ctrl+Shift+R)
→ Check if page is published (not draft)

**"Want more examples?"**
→ See: HOW_TO_USE_PAGE_BUILDER.md

---

## ✅ READY TO USE!

- ✓ Build passed
- ✓ Managers integrated
- ✓ Database ready
- ✓ Documentation complete

**START CREATING PAGES NOW! 🚀**

---

