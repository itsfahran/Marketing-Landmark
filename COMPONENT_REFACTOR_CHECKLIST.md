# 🔄 Component Refactor Checklist — Database-First Pattern

**Apply this checklist to each component systematically.**

---

## Quick Refactor Template

### Before
```jsx
<h1>{heroData?.heading || "Hardcoded"}</h1>
```

### After
```jsx
import { hasDbData } from "../../lib/dataHandler";

const DEFAULT_DATA = {
  heading: "Hardcoded Heading",
};

const data = hasDbData(heroData) ? heroData : DEFAULT_DATA;

<h1>{data.heading}</h1>
```

---

## Components by Priority

### ⭐⭐⭐ CRITICAL (Update First)

#### 1. **Geo.jsx** - Main Geo page
- [ ] Import `hasDbData`
- [ ] Create `DEFAULT_GEO_HERO`
- [ ] Update hero section with DB-first logic
- [ ] Update "Modern Info" section
- [ ] Pass data to child components properly
- [ ] Test with no DB data
- [ ] Test with partial DB data
- [ ] Test with full DB data

#### 2. **Local.jsx** - Main Local page
- [ ] Import `hasDbData`
- [ ] Create `DEFAULT_LOCAL_HERO`
- [ ] Update hero section
- [ ] Update all sections with DB-first
- [ ] Test all scenarios

#### 3. **Seo.jsx** - Main Seo page
- [ ] Import `hasDbData`
- [ ] Create `DEFAULT_SEO_HERO`
- [ ] Update hero section
- [ ] Update all sections
- [ ] Test all scenarios

---

### ⭐⭐⭐ Component Sections (High Priority)

#### 4. **Geo_Scope.jsx**
- [ ] Import `hasDbData`
- [ ] Create `DEFAULT_SCOPE_CARDS`
- [ ] Database-first logic for cards
- [ ] Remove hardcoded fallback

#### 5. **Geo_Pricing.jsx**
- [ ] Import `hasDbData`
- [ ] Create `DEFAULT_PRICING`
- [ ] Apply DB-first pattern
- [ ] Test with package data

#### 6. **Geo_Process.jsx**
- [ ] Import `hasDbData`
- [ ] Create `DEFAULT_STEPS`
- [ ] Database-first for steps
- [ ] No hardcoded merge

#### 7. **Geo_Benefits.jsx**
- [ ] Import `hasDbData`
- [ ] Create `DEFAULT_BENEFITS`
- [ ] Apply pattern to all benefit items

#### 8. **LocalScope.jsx**
- [ ] Import `hasDbData`
- [ ] Create `DEFAULT_SCOPE`
- [ ] Database-first logic

#### 9. **LocalPricing.jsx**
- [ ] Import `hasDbData`
- [ ] Create `DEFAULT_PRICING`
- [ ] Apply pattern

#### 10. **SeoScope.jsx**
- [ ] Import `hasDbData`
- [ ] Create `DEFAULT_SCOPE`
- [ ] Apply DB-first

---

### ⭐⭐ Section Components (Medium Priority)

#### 11. **Process.jsx** (Generic)
- [ ] Import `hasDbData`
- [ ] Create `DEFAULT_PROCESS`
- [ ] Apply to all process steps
- [ ] Handle empty arrays properly

#### 12. **Choose.jsx** (Generic)
- [ ] Import `hasDbData`
- [ ] Create `DEFAULT_FEATURES`
- [ ] Database-first for all features

#### 13. **Brand.jsx**
- [ ] Import `hasDbData`
- [ ] Create `DEFAULT_BRANDS`
- [ ] Apply pattern

#### 14. **Hire.jsx** / **Service.jsx**
- [ ] Import `hasDbData`
- [ ] Create defaults
- [ ] Apply DB-first

#### 15. **Testimonials.jsx** (Generic)
- [ ] Already fetches from DB
- [ ] Verify no hardcoded fallback for individual fields
- [ ] Ensure clean data-only rendering

#### 16. **VideoTestimonials.jsx** (Generic)
- [ ] Verify DB-first rendering
- [ ] No hardcoded content mixing

#### 17. **Contact_Section.jsx**
- [ ] Import `hasDbData`
- [ ] Create defaults
- [ ] Apply pattern

#### 18. **Portfolio_Section.jsx**
- [ ] Import `hasDbData`
- [ ] Create defaults
- [ ] Apply pattern

#### 19. **About_Section.jsx**
- [ ] Import `hasDbData`
- [ ] Create defaults
- [ ] Apply pattern

#### 20. **HomepageServices.jsx**
- [ ] Already has fetch
- [ ] Verify no hardcoded mix
- [ ] Clean rendering

---

### ⭐ Lower Priority (Can be done later)

- [ ] SeoCaseStudies.jsx
- [ ] SeoHire.jsx
- [ ] SeoFaqs.jsx
- [ ] GeoContact.jsx
- [ ] SeoContact.jsx
- [ ] Geo_Platforms.jsx
- [ ] GeoHireSection.jsx
- [ ] LocalHero.jsx

---

## Refactor Workflow

### For Each Component:

```
1. BACKUP: Copy original file
2. READ: Understand current structure
3. IDENTIFY: Find all hardcoded data
4. CREATE: Define DEFAULT_* object
5. IMPORT: Add hasDbData helper
6. REPLACE: Remove all || "hardcoded" patterns
7. APPLY: Use DB-first logic
8. TEST: All three scenarios
9. COMMIT: Git add + commit
10. VERIFY: Manual testing
```

---

## Testing Checklist (For Each Component)

### Test 1: No Database Data
```
[ ] Component loads
[ ] Shows hardcoded defaults
[ ] No console errors
[ ] No undefined values
```

### Test 2: Full Database Data
```
[ ] Component loads DB data
[ ] Shows ONLY DB content
[ ] Hardcoded NOT visible
[ ] All fields displayed
```

### Test 3: Partial Database Data
```
[ ] Component loads DB data
[ ] Shows ONLY saved fields
[ ] Unsaved fields NOT visible ⭐ KEY TEST
[ ] No mixing with hardcoded
```

### Test 4: Update Live
```
[ ] Admin saves new data
[ ] Page shows new data
[ ] Hardcoded disappears
[ ] Refresh confirms change
```

---

## Code Patterns to Implement

### Pattern 1: Simple Field
```jsx
const data = hasDbData(heroData) ? heroData : DEFAULT_HERO;
<h1>{data.heading}</h1>
```

### Pattern 2: Conditional Rendering
```jsx
{data.heading && <h1>{data.heading}</h1>}
```

### Pattern 3: Array Fields
```jsx
if (hasDbData(items) && items.length > 0) {
  return items.map(...);
}
return <DefaultItems />;
```

### Pattern 4: Complex Sections
```jsx
if (hasDbData(heroData)) {
  return <DatabaseVersion data={heroData} />;
}
return <HardcodedVersion />;
```

---

## Things to REMOVE

❌ All `|| "hardcoded default"`
❌ All `? value : "hardcoded"`
❌ Hardcoded array merges
❌ Hardcoded object spreads
❌ Mixed DB + hardcoded rendering

## Things to ADD

✅ `import { hasDbData }`
✅ `const DEFAULT_*` objects
✅ Database-first conditionals
✅ Proper validation checks
✅ Comments explaining data source

---

## Progress Tracking

- [ ] Geo.jsx
- [ ] Local.jsx
- [ ] Seo.jsx
- [ ] Geo_Scope.jsx
- [ ] Geo_Pricing.jsx
- [ ] Geo_Process.jsx
- [ ] Geo_Benefits.jsx
- [ ] LocalScope.jsx
- [ ] LocalPricing.jsx
- [ ] SeoScope.jsx
- [ ] Process.jsx
- [ ] Choose.jsx
- [ ] Brand.jsx
- [ ] Hire.jsx
- [ ] Service.jsx
- [ ] Testimonials.jsx
- [ ] VideoTestimonials.jsx
- [ ] Contact_Section.jsx
- [ ] Portfolio_Section.jsx
- [ ] About_Section.jsx
- [ ] HomepageServices.jsx

---

## Batch Commit Format

After every 3-5 components:

```
git commit -m "refactor: Apply database-first pattern to [component names]

- Removed hardcoded fallbacks
- Added hasDbData checks
- Isolated DEFAULT_* objects
- Ensured DB-only or hardcoded-only rendering
- No mixing or merging

Components updated:
- Geo.jsx
- Geo_Scope.jsx
- Geo_Pricing.jsx

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Verification Checklist (Final)

- [ ] All components use `hasDbData` or similar
- [ ] No `||` with hardcoded defaults
- [ ] DEFAULT_* objects separate
- [ ] Tests pass for all scenarios
- [ ] No console errors
- [ ] Admin can control what shows
- [ ] Hardcoded only shows when DB empty
- [ ] Database data prioritized always
- [ ] All commits documented
- [ ] Code review passed

---

**Start with CRITICAL components, then move to others.**
**Quality over speed - test each one!**
