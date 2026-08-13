# Admin Panel - Complete Service Editor Guide

## Database Tables Created

### Core Tables
- **templates** - SEO, GEO, Local template definitions
- **services** - Service instances with hero fields for all templates
- **template_sections** - Which sections belong to each template

### Component Tables (All Templates)
- **service_pricing** - Pricing packages
- **service_pricing_features** - Features per pricing package
- **service_scope_cards** - Scope/Overview cards
- **service_process_steps** - Process steps with icons
- **service_tools** - Tools/Platforms used
- **service_faqs** - Frequently asked questions

### Template-Specific Tables

#### LOCAL ONLY
- **service_business_features** - Business section (01, 02, 03, 04)

#### GEO ONLY
- **service_benefits** - Benefits section (01, 02, 03)
- **service_platforms** - Platforms we optimize for

---

## Admin Panel - Editable Sections by Template

### LOCAL Template Tabs
When you create a service with **LOCAL** template and go to edit:

| Tab | Database Tables | Fields |
|-----|-----------------|--------|
| 🎯 Hero | services | heading, subheading, 3 CTA buttons |
| 🏢 Business | service_business_features | 4 numbered features (01-04) |
| 💰 Pricing | service_pricing + service_pricing_features | Packages with features |
| ✅ Scope | service_scope_cards | 3+ scope cards with icons |
| ❓ FAQs | service_faqs | Questions and answers |

### GEO Template Tabs
When you create a service with **GEO** template and go to edit:

| Tab | Database Tables | Fields |
|-----|-----------------|--------|
| 🎯 GEO Hero | services | heading, subheading, 3 features, 2 buttons |
| 📊 Benefits | service_benefits | 3 numbered benefits (01-03) |
| 🔗 Platforms | service_platforms | 5+ platform names and logos |
| 💰 Pricing | service_pricing + service_pricing_features | Packages with features |
| ✅ Scope | service_scope_cards | 3+ scope cards with icons |
| ❓ FAQs | service_faqs | Questions and answers |

### SEO Template Tabs
When you create a service with **SEO** template and go to edit:

| Tab | Database Tables | Fields |
|-----|-----------------|--------|
| 🎯 Hero | services | heading, subheading, 2 CTA buttons |
| 💰 Pricing | service_pricing + service_pricing_features | Packages with features |
| ✅ Scope | service_scope_cards | 3+ scope cards with icons |
| ❓ FAQs | service_faqs | Questions and answers |

---

## How It Works

### Step 1: Create Service
1. Go to `/admin/services`
2. Click "Add Service"
3. Select template: LOCAL / GEO / SEO
4. Fill: Name, Slug, Description
5. Click Create

### Step 2: Edit Service Data
1. Go to `/admin/services`
2. Click **→** arrow next to service name
3. See tabs based on template
4. Fill each section:
   - **Hero** → Heading, buttons
   - **Business/Benefits** → Numbered items
   - **Scope** → Icon + Title + Description
   - **Pricing** → Name + Price + Features
   - **Platforms** → Name + Logo URL
   - **FAQs** → Question + Answer
5. Data saves automatically to database

### Step 3: View Live Page
1. Visit `/service/your-service-slug`
2. Page displays database data (or hardcoded defaults if empty)
3. Shows only sections for that template

---

## Database Schema Summary

```
services
├── template_id → templates
├── name, slug, description
├── hero_heading, hero_subheading, cta1_text, cta1_link, cta2_text, cta2_link (LOCAL/SEO)
├── geo_heading, geo_subheading, geo_feature_1-3, geo_cta1_text-link, geo_cta2_text-link (GEO)
├── business_video_url, business_heading, business_subheading (LOCAL)
└── status (draft/published)

service_pricing
├── service_id → services
├── name, subtitle, price, currency, billing_period, is_popular
└── service_pricing_features (feature_text, is_disabled)

service_scope_cards
├── service_id → services
├── icon_text, title, description, sort_order

service_process_steps
├── service_id → services
├── title, description, icon_name, sort_order

service_tools
├── service_id → services
├── title, icon_name, icon_url, sort_order

service_benefits (GEO)
├── service_id → services
├── number, title, description, sort_order

service_platforms (GEO)
├── service_id → services
├── name, logo_url, sort_order

service_business_features (LOCAL)
├── service_id → services
├── number, title, description, sort_order

service_faqs
├── service_id → services
├── question, answer, sort_order
```

---

## Next Steps

1. Run **COMPLETE_SERVICES_SCHEMA.sql** in Supabase
2. Create a GEO or LOCAL service
3. Edit its sections via admin tabs
4. Visit `/service/slug` to see it live

All admin forms are built and connected! 🚀
