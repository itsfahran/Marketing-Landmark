# Admin Panel Integration Guide - Separate Data Managers

## 📚 Overview

Three manager components have been created to handle separate component data:

1. **ScopeCardManager.jsx** - Manage scope cards (3-5 cards per component)
2. **PricingManager.jsx** - Manage pricing packages and their features
3. **ProcessStepsManager.jsx** - Manage process steps (6-8 steps per component)

These managers should be integrated into `ComponentDataForms.jsx` to provide a complete admin experience.

---

## 🔧 Integration Steps

### Step 1: Import Managers in ComponentDataForms.jsx

```jsx
import ScopeCardManager from './ScopeCardManager';
import PricingManager from './PricingManager';
import ProcessStepsManager from './ProcessStepsManager';
```

### Step 2: Add State for Manager Visibility

```jsx
const [openManager, setOpenManager] = useState(null);
```

### Step 3: Add Manager Buttons to Each Component Form

In the `ComponentForm` function, add manager buttons after the form fields:

#### For SCOPE Component:
```jsx
{componentId === 'scope' && (
  <>
    <FormField /* existing fields */ />
    
    {/* Add button */}
    <button 
      className="cdf-manage-btn"
      onClick={() => setOpenManager('scope')}
    >
      📝 Manage Scope Cards
    </button>
  </>
)}
```

#### For PRICING Component:
```jsx
{componentId === 'pricing' && (
  <>
    <FormField /* existing fields */ />
    
    {/* Add button */}
    <button 
      className="cdf-manage-btn"
      onClick={() => setOpenManager('pricing')}
    >
      💰 Manage Pricing Packages
    </button>
  </>
)}
```

#### For PROCESS Component:
```jsx
{componentId === 'process' && (
  <>
    <FormField /* existing fields */ />
    
    {/* Add button */}
    <button 
      className="cdf-manage-btn"
      onClick={() => setOpenManager('process')}
    >
      🔄 Manage Process Steps
    </button>
  </>
)}
```

### Step 4: Add Manager Modal Rendering

At the bottom of `ComponentDataForms.jsx`, add:

```jsx
{/* Managers Modals */}
{openManager === 'scope' && (
  <ScopeCardManager
    componentId={selectedComponents.find(c => c.id === 'scope')?.id}
    pageId={pageId}
    template={selectedComponents.find(c => c.id === 'scope')?.template}
    onClose={() => setOpenManager(null)}
  />
)}

{openManager === 'pricing' && (
  <PricingManager
    componentId={selectedComponents.find(c => c.id === 'pricing')?.id}
    pageId={pageId}
    template={selectedComponents.find(c => c.id === 'pricing')?.template}
    onClose={() => setOpenManager(null)}
  />
)}

{openManager === 'process' && (
  <ProcessStepsManager
    componentId={selectedComponents.find(c => c.id === 'process')?.id}
    pageId={pageId}
    template={selectedComponents.find(c => c.id === 'process')?.template}
    onClose={() => setOpenManager(null)}
  />
)}
```

### Step 5: Add CSS Styling

Add to `ComponentDataForms.css`:

```css
.cdf-manage-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #8b5cf6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  margin-top: 12px;
  width: 100%;
  justify-content: center;
}

.cdf-manage-btn:hover {
  background: #7c3aed;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.cdf-manage-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

---

## 📊 Complete Workflow

### User Journey:

```
1. Admin clicks "Edit Page"
   ↓
2. Admin selects components (Hero, Scope, Pricing, Process)
   ↓
3. Admin chooses template per component
   ↓
4. ComponentDataForms shows forms for each enabled component:
   
   ┌─ HERO Component Form ─────────┐
   │ Heading: [input]              │
   │ Description: [textarea]       │
   │ [Save Hero Button]            │
   └───────────────────────────────┘
   
   ┌─ SCOPE Component Form ────────┐
   │ Heading: [input]              │
   │ Description: [textarea]       │
   │ [📝 Manage Scope Cards] ◄─── Click to open manager
   │ [Save Scope Button]           │
   └───────────────────────────────┘
   
   ┌─ PRICING Component Form ──────┐
   │ Heading: [input]              │
   │ Description: [textarea]       │
   │ [💰 Manage Pricing Packages]   │
   │ [Save Pricing Button]         │
   └───────────────────────────────┘
   
   ┌─ PROCESS Component Form ──────┐
   │ Heading: [input]              │
   │ Description: [textarea]       │
   │ [🔄 Manage Process Steps]      │
   │ [Save Process Button]         │
   └───────────────────────────────┘

5. User clicks "📝 Manage Scope Cards"
   ↓
6. ScopeCardManager modal opens:
   
   ┌─ Manage Scope Cards (GEO) ────────┐
   │ Existing Cards:                   │
   │ ☰ 01 | Audit | [Edit] [Delete]   │
   │ ☰ 02 | Optimization | [E] [D]    │
   │ ☰ 03 | Visibility | [Edit] [Del] │
   │ [+ Add New Card]                  │
   └───────────────────────────────────┘

7. User clicks "[Edit]" on a card
   ↓
8. Edit Card Modal opens:
   
   ┌─ Edit Card ──────────────────┐
   │ Number: [01]                 │
   │ Title: [Audit]               │
   │ Description: [textarea]      │
   │ Icon Name: [input]           │
   │ Icon Image URL: [input]      │
   │ [Save Card] [Cancel]         │
   └──────────────────────────────┘

9. User makes changes and clicks "Save Card"
   ↓
10. Card saved to database
    Modal refreshes with updated data
    User can continue editing other cards
    ↓
11. User clicks "X" to close manager
    ↓
12. Back to ComponentDataForms
    ↓
13. User clicks "Publish Page"
    ↓
14. Page published with all component data including separate items
    ↓
15. Public page renders with:
    - Hero section (data from component_hero table)
    - Scope section with 3 cards (data from component_scope + component_scope_cards tables)
    - Pricing section with 3 packages (data from component_pricing + component_pricing_packages + component_pricing_features tables)
    - Process section with 8 steps (data from component_process + component_process_steps tables)
```

---

## 🗄️ Database Flow

### Scope Cards:
```
component_scope (Main)
  └─ component_scope_cards (Sub-items)
     ├─ Card 1 (number, title, description, icon)
     ├─ Card 2
     └─ Card 3
```

### Pricing Packages:
```
component_pricing (Main)
  └─ component_pricing_packages (Sub-items)
     ├─ Package 1 (name, price, pages)
     │  └─ component_pricing_features
     │     ├─ Feature 1
     │     ├─ Feature 2
     │     └─ Feature N
     ├─ Package 2
     │  └─ component_pricing_features
     └─ Package 3
```

### Process Steps:
```
component_process (Main)
  └─ component_process_steps (Sub-items)
     ├─ Step 1 (title, description, icon)
     ├─ Step 2
     └─ Step N
```

---

## ✅ Manager Features

### ScopeCardManager:
- ✅ View all scope cards
- ✅ Add new cards
- ✅ Edit card details (number, title, description, icon)
- ✅ Delete cards
- ✅ Drag & drop to reorder
- ✅ Auto-save ordering to database

### PricingManager:
- ✅ View all pricing packages
- ✅ Add new packages
- ✅ Edit package details (name, price, currency, period, pages, popular flag)
- ✅ Delete packages
- ✅ Manage features for each package
- ✅ Add/remove features under packages
- ✅ Mark features as included/excluded
- ✅ Drag & drop features to reorder

### ProcessStepsManager:
- ✅ View all process steps
- ✅ Add new steps
- ✅ Edit step details (number, title, description, icon)
- ✅ Delete steps
- ✅ Drag & drop to reorder
- ✅ Auto-update step numbers on reorder
- ✅ Auto-save ordering to database

---

## 🎯 Implementation Checklist

- [ ] Import all three managers in ComponentDataForms.jsx
- [ ] Add `openManager` state to track which manager is open
- [ ] Add manager buttons for scope, pricing, process components
- [ ] Implement manager modal rendering logic
- [ ] Add CSS styling for manage buttons
- [ ] Add CSS styling for modals (already in ItemManager.css)
- [ ] Test adding scope cards
- [ ] Test adding pricing packages and features
- [ ] Test adding process steps
- [ ] Test drag & drop reordering
- [ ] Test publishing page with all data
- [ ] Verify data persists on page reload
- [ ] Verify public page renders correctly

---

## 🔍 Testing Scenarios

### Scenario 1: Add Scope Cards
1. Create page → Enable Scope (GEO) → Fill main data
2. Click "Manage Scope Cards"
3. Add 3 cards: Audit, Optimization, Visibility
4. Save page
5. View public page → Verify 3 cards appear in correct order

### Scenario 2: Add Pricing Packages with Features
1. Create page → Enable Pricing (SEO) → Fill main data
2. Click "Manage Pricing Packages"
3. Add Package 1: Basic, ₹59,999/Month, 10 pages
4. Add 15 features under Basic (with checkmarks)
5. Add Package 2: Standard (mark as popular)
6. Add Package 3: Premium
7. Save page
8. View public page → Verify 3 packages with all features

### Scenario 3: Add Process Steps
1. Create page → Enable Process (LOCAL) → Fill main data
2. Click "Manage Process Steps"
3. Add 8 steps: Website Audit, Competitor Analysis, etc.
4. Reorder steps using drag & drop
5. Save page
6. View public page → Verify steps in correct order with proper numbering

### Scenario 4: Mixed Components
1. Create page with: Hero (SEO) + Scope (GEO) + Pricing (LOCAL)
2. Add data to all three including separate items
3. Publish page
4. View public page → Verify:
   - Hero renders SEO style
   - Scope cards render GEO style
   - Pricing renders LOCAL style

---

## 📝 Code Example: Complete Integration

```jsx
// ComponentDataForms.jsx - Complete Integration

import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '../../lib/supabase';
import ScopeCardManager from './ScopeCardManager';
import PricingManager from './PricingManager';
import ProcessStepsManager from './ProcessStepsManager';

const ComponentDataForms = ({ pageId, selectedComponents }) => {
  const supabase = getSupabaseClient();
  const [openManager, setOpenManager] = useState(null); // ADD THIS
  // ... rest of existing code ...

  const scopeComponent = selectedComponents.find(c => c.id === 'scope');
  const pricingComponent = selectedComponents.find(c => c.id === 'pricing');
  const processComponent = selectedComponents.find(c => c.id === 'process');

  // ... existing component mapping logic ...

  return (
    <div className="cdf-container">
      {selectedComponents.map(comp => (
        <ComponentForm
          key={`${comp.id}-${comp.template}`}
          // ... existing props ...
        />
      ))}

      {/* MANAGERS - ADD AT END */}
      {scopeComponent && openManager === 'scope' && (
        <ScopeCardManager
          componentId={scopeComponent.id}
          pageId={pageId}
          template={scopeComponent.template}
          onClose={() => setOpenManager(null)}
        />
      )}

      {pricingComponent && openManager === 'pricing' && (
        <PricingManager
          componentId={pricingComponent.id}
          pageId={pageId}
          template={pricingComponent.template}
          onClose={() => setOpenManager(null)}
        />
      )}

      {processComponent && openManager === 'process' && (
        <ProcessStepsManager
          componentId={processComponent.id}
          pageId={pageId}
          template={processComponent.template}
          onClose={() => setOpenManager(null)}
        />
      )}
    </div>
  );
};
```

---

## 🚀 Future Enhancements

- [ ] Features Items Manager (for features/benefits component)
- [ ] Testimonials Manager (for testimonials component)
- [ ] Bulk import/export data
- [ ] Duplicate package/step/card
- [ ] Template switching while preserving data
- [ ] Undo/redo functionality
- [ ] Batch operations (delete multiple items)
- [ ] Advanced validation and error handling
- [ ] Real-time collaboration indicators

---

