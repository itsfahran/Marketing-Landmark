# 🗄️ Database-First Data Handling Pattern

## Problem

Currently, components merge database data with hardcoded data:
```jsx
❌ WRONG:
{heroData?.geo_heading || "Hardcoded Heading"}
// Shows hardcoded if admin leaves field empty!
```

**When admin saves partial data:**
- Admin saves: title ✅
- Admin doesn't save: description ❌
- Result: title from DB + description hardcoded (MIXED) ❌

## Solution

**Database-First Pattern: Use ONLY ONE source, never mix**

```jsx
✅ CORRECT:
if (hasDbData) {
  showDatabaseVersion(heroData)
} else {
  showHardcodedVersion()
}

// No mixing! No fallback!
```

---

## Implementation Guide

### Step 1: Import Helper Functions

```jsx
import { hasDbData, chooseData, renderDbOrHardcoded } from "../../lib/dataHandler";
```

### Step 2: Define Hardcoded Defaults

Keep in SEPARATE object (not mixed in JSX):

```jsx
const DEFAULT_HERO = {
  heading: "Professional SEO Expert",
  subheading: "10+ years experience",
  cta_text: "Get Started",
  cta_link: "/contact",
};
```

### Step 3: Check if Database Data Exists

```jsx
const heroData = props.data;  // From database
const hasData = hasDbData(heroData);
```

### Step 4: Use Database-First Logic

#### **Pattern A: Conditional Rendering (Recommended)**

```jsx
if (hasDbData(heroData)) {
  // USE ONLY DATABASE DATA
  return (
    <div>
      <h1>{heroData.heading}</h1>
      <p>{heroData.subheading}</p>
      <button>{heroData.cta_text}</button>
    </div>
  );
} else {
  // USE ONLY HARDCODED DATA
  return (
    <div>
      <h1>{DEFAULT_HERO.heading}</h1>
      <p>{DEFAULT_HERO.subheading}</p>
      <button>{DEFAULT_HERO.cta_text}</button>
    </div>
  );
}
```

#### **Pattern B: Ternary with Object Selection (Cleaner)**

```jsx
const displayData = hasDbData(heroData) ? heroData : DEFAULT_HERO;

return (
  <div>
    <h1>{displayData.heading}</h1>
    <p>{displayData.subheading}</p>
    <button>{displayData.cta_text}</button>
  </div>
);
```

#### **Pattern C: Render Functions (Best for Complex)**

```jsx
const renderContent = () => renderDbOrHardcoded(
  heroData,
  (data) => (
    <div>
      <h1>{data.heading}</h1>
      <p>{data.subheading}</p>
    </div>
  ),
  () => (
    <div>
      <h1>{DEFAULT_HERO.heading}</h1>
      <p>{DEFAULT_HERO.subheading}</p>
    </div>
  )
);

return renderContent();
```

---

## Real Example: GEO Hero

### ❌ BEFORE (Wrong - Mixes data)
```jsx
<h1>
  {heroData?.geo_heading || "Hardcoded Heading"}
  <span>{heroData?.geo_heading_accent || "Hardcoded Accent"}</span>
</h1>
<p>
  {heroData?.geo_subheading || "Hardcoded Subheading"}
</p>
```

**Problem:** If admin saves only heading, description shows hardcoded!

### ✅ AFTER (Correct - Database first)
```jsx
const GEO_DEFAULTS = {
  heading: "Hardcoded Heading",
  heading_accent: "Hardcoded Accent",
  subheading: "Hardcoded Subheading",
};

const displayData = hasDbData(heroData) 
  ? heroData 
  : GEO_DEFAULTS;

return (
  <>
    {displayData.heading && (
      <h1>
        {displayData.heading}
        {displayData.heading_accent && <span>{displayData.heading_accent}</span>}
      </h1>
    )}
    {displayData.subheading && <p>{displayData.subheading}</p>}
  </>
);
```

**Result:** 
- Admin saves heading → shows ONLY heading (no hardcoded subheading)
- Admin saves nothing → shows ONLY hardcoded defaults
- Never mixing!

---

## Available Helper Functions

### `hasDbData(data)`
```jsx
// Check if database data exists
if (hasDbData(heroData)) {
  // Data is valid, use it
} else {
  // No data, use hardcoded
}
```

### `chooseData(dbValue, hardcoded)`
```jsx
// Simple choice between DB or hardcoded
const heading = chooseData(
  heroData?.heading,
  "Hardcoded Heading"
);
// Returns dbValue if valid, otherwise hardcoded
```

### `renderDbOrHardcoded(data, renderDb, renderHardcoded)`
```jsx
// Render either DB version or hardcoded version
renderDbOrHardcoded(
  heroData,
  (data) => <DatabaseVersion data={data} />,
  () => <HardcodedVersion />
)
```

### `filterEmptyFields(obj)`
```jsx
// Remove empty fields from database object
const cleanData = filterEmptyFields(heroData);
// { title: "SEO", description: "" } → { title: "SEO" }
```

### `validateData(data, requiredFields)`
```jsx
// Validate if database has required fields
if (validateData(heroData, ['heading', 'subheading'])) {
  // Both fields have values
}
```

---

## Components to Update (Priority Order)

1. **Hero Components** ⭐⭐⭐
   - Seo.jsx → Hero section
   - Geo.jsx → Hero section
   - Local.jsx → Hero section

2. **Scope Components** ⭐⭐⭐
   - Geo_Scope.jsx
   - SeoScope.jsx
   - LocalScope.jsx

3. **Process Components** ⭐⭐⭐
   - Geo_Process.jsx
   - SeoProcess.jsx
   - LocalProcess.jsx

4. **Pricing Components** ⭐⭐⭐
   - Geo_Pricing.jsx
   - SeoPricing.jsx
   - LocalPricing.jsx

5. **Other Components** ⭐⭐
   - Geo_Benefits.jsx
   - GeoHireSection.jsx
   - SeoCaseStudies.jsx
   - Etc.

6. **Section Components** ⭐
   - Testimonials.jsx
   - Choose.jsx
   - Brand.jsx
   - Process.jsx

---

## Pattern Summary

### DON'T DO THIS:
```jsx
❌ {data?.field || "hardcoded"}
❌ {data?.field ? data.field : "hardcoded"}
❌ Mixing DB and hardcoded in same render
```

### DO THIS INSTEAD:
```jsx
✅ const displayData = hasDbData(data) ? data : DEFAULTS;
✅ {displayData.field}
✅ Database-only OR hardcoded-only, never mix
```

### KEY RULE:
**If database data exists (even partially), use ONLY database.**
**If database data doesn't exist, use hardcoded.**
**Never show both together!**

---

## Testing Your Changes

### Test 1: No Database Data
```
1. Component loads (no database query)
2. Should show hardcoded defaults
3. No console errors
```

### Test 2: Full Database Data
```
1. Admin saves all fields
2. Component loads database data
3. Shows ONLY database fields
4. No hardcoded defaults visible
```

### Test 3: Partial Database Data
```
1. Admin saves only SOME fields
2. Component loads database data
3. Shows ONLY saved fields
4. Unsaved fields NOT visible (even if hardcoded)
✅ This is the key test!
```

### Test 4: Update from Hardcoded to Database
```
1. Component showing hardcoded → Refresh
2. Admin saves database data → Wait for save
3. Page refreshes/reload
4. Should show database data only
5. Hardcoded should disappear
```

---

## Migration Checklist

- [ ] Create DEFAULT_* object for each component
- [ ] Import hasDbData helper
- [ ] Check if dbData exists
- [ ] Use conditional rendering (database OR hardcoded)
- [ ] Remove all `||` fallbacks with hardcoded
- [ ] Test with no database data
- [ ] Test with partial database data
- [ ] Test with full database data
- [ ] Verify hardcoded never shows when DB data exists
- [ ] Commit and push

---

**This pattern ensures:**
- ✅ Database data is authoritative
- ✅ Hardcoded data is fallback only
- ✅ No mixing or confusion
- ✅ Admin can control what shows
- ✅ Clean separation of concerns
