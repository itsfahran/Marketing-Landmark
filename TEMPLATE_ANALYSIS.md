# 🔍 Detailed Template Analysis

## SEO Template Structure

### Hero Section
**File:** `Seo.jsx` (Line 45+)
```
Hardcoded data with packages array
```

**Fields needed:**
- N/A (using hardcoded data)

### Pricing Section  
**File:** `Seo.jsx`
**Data Structure:**
- name (string): "Basic", "Standard", "Premium"
- subtitle (string): "Best for..."
- price (string): "59,999"
- pages (string): "Upto 10 Page Website SEO"
- features (array of strings): ["Setup Google Search Console", ...]
- popular (boolean): true/false

**Total Packages:** 3 (Basic, Standard, Premium)
**Features per package:** 20-30 features each

---

## GEO Template Structure

### Hero Section
**File:** `Geo.jsx` (Line 18+)
**Service Data expects:**
- geo_heading (string)
- geo_heading_accent (string)
- geo_subheading (string)
- geo_feature_1 (string)
- geo_feature_2 (string)
- geo_feature_3 (string)
- geo_cta1_text (string)
- geo_cta1_link (string)
- geo_cta2_text (string)
- geo_cta2_link (string)

### Components Used:
1. **Geo_Scope** - Services scope cards
2. **Geo_Pricing** - Pricing packages
3. **Geo_Process** - Process steps
4. **Geo_Benefits** - Benefits section
5. **Geo_Platforms** - Platforms section
6. **GeoHireSection** - Hire section
7. **Testimonials** - Client testimonials
8. **Choose** - Why choose us
9. **GeoContact** - Contact form

---

## LOCAL Template Structure

### Hero Section
**File:** `LocalHero.jsx`
**Service Data expects:**
- heroData (object with various fields)
- businessFeatures (array)
- serviceId (UUID)

### Components Used:
1. **LocalHero** - Hero section
2. **LocalScope** - Services scope
3. **LocalPricing** - Pricing
4. **Testimonials** - Client testimonials
5. **Choose** - Why choose us
6. **SeoFaqs** - FAQs (reused from SEO)
7. **SeoContact** - Contact (reused from SEO)

---

## Current Issues

1. **RLS Policy Error:** 
   - "new row violates row-level security policy"
   - Cause: `auth.role() = 'authenticated'` requires user to be authenticated
   - Fix: Update policy to allow insert regardless of auth status or disable RLS temporarily

2. **Incomplete Schema:** 
   - Database doesn't have all fields each template needs
   - Need to add template-specific fields for each component

3. **No Template Logic:**
   - Components need to know which template they're using
   - Different templates need different fields

---

## Next Steps

1. Fix RLS policies
2. Create complete schema with ALL template-specific fields
3. Create template-aware forms
4. Build proper data rendering logic
