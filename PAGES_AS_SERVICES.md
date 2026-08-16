# 📄 Pages as Services — Automatic Integration

## کیا ہوتا ہے؟

جب Admin **Page Builder** سے نیا page بناتا ہے:

1. ✅ `pages` table میں save ہوتا ہے
2. ✅ **`services` table میں بھی automatically entry بن جاتی ہے**
3. ✅ Page `/services/{slug}` پر accessible ہوتا ہے
4. ✅ Services Manager میں دکھتا ہے

---

## مثال (Example)

### Admin یہ کریں:
```
Admin Panel → Pages → + New Page
Name: "Web Development"
Components: Select, Configure, Save
```

### System یہ کریں:
```
✅ pages table میں insert:
   - name: "Web Development"
   - slug: "web-development"
   - status: "draft"
   - components_config: [...]

✅ services table میں insert:
   - title: "Web Development"
   - description: "Web Development"
   - icon: "📄"
   - page_url: "/services/web-development"
   - show_on_homepage: false (default)
   - show_in_navbar: false (default)
   - is_active: false (if draft)
```

### Admin کو ملتا ہے:
```
✅ Page published at: /services/web-development
✅ Service in: Services Manager
✅ Can toggle:
   📱 Homepage (feature karey ya na)
   🔗 Navbar (dropdown mein dakhal karey)
```

---

## کام کا Flow

### **Step 1: Create Page**
```
Admin Panel 
  ↓
Pages Manager 
  ↓
+ New Page → Name, Components, Save
  ↓
page_url: /services/{slug} ← AUTO GENERATED
```

### **Step 2: Manage as Service**
```
Admin Panel
  ↓
Services Manager
  ↓
Find newly created page
  ↓
Toggle 📱 Homepage (feature karne ke liye)
Toggle 🔗 Navbar (dropdown mein dalne ke liye)
```

### **Step 3: Access Page**
```
Frontend
  ↓
https://yoursite.com/services/web-development
  ↓
Page renders with configured components
```

---

## Database Changes

### `pages` table (پہلے سے ہے)
```sql
- id
- name: "Web Development"
- slug: "web-development"
- status: "draft" | "published"
- components_config: [...]
```

### `services` table (خودکار entry)
```sql
- id: auto
- title: "Web Development" (pages.name سے آتا ہے)
- description: "Web Development"
- icon: "📄"
- page_url: "/services/web-development" ← IMPORTANT
- show_on_homepage: false (default)
- show_in_navbar: false (default)
- is_active: true/false (pages.status سے depend کرتا ہے)
```

---

## خصوصیات (Features)

✅ **Automatic Sync:**
- Page update ہو تو service بھی update ہو جاتی ہے

✅ **URL Format:**
- Page: `/services/web-development`
- Service: `page_url: "/services/web-development"`

✅ **Status Sync:**
- Page status = "published" → service is_active = true
- Page status = "draft" → service is_active = false

✅ **Admin Control:**
- Services Manager سے fully control کر سکتے ہو
- Homepage پر feature کر سکتے ہو
- Navbar dropdown میں add کر سکتے ہو

---

## مثال Scenario

### **Scenario:** 3 نئے Service Pages بنانا

**Admin کے قدم:**
1. Page Builder → "Web Development" page بناو
   - Auto service بن جاتا ہے ✓
   
2. Page Builder → "Mobile App" page بناو
   - Auto service بن جاتا ہے ✓
   
3. Page Builder → "Branding" page بناو
   - Auto service بن جاتا ہے ✓

4. Services Manager jao
   - 3 نئے pages دکھیں گے
   - "Web Development" کے 📱 Homepage اور 🔗 Navbar check کرو
   - "Mobile App" کے Homepage check کرو
   - "Branding" کے Homepage uncheck رکھو

**Result:**
- Homepage: Web Dev + Mobile App دونوں دکھیں گے (3 existing + 2 new = 5 total, but only 3 featured show)
- Navbar: Web Dev + Mobile App dropdown میں ہوں گی
- `/services/web-development` accessible ہے
- `/services/mobile-app` accessible ہے
- `/services/branding` accessible ہے (لیکن homepage/navbar میں نہیں)

---

## FAQ

**Q: کیا ہر page کو service بنانا پڑتا ہے؟**
A: نہیں، صرف وہ pages جو `pages` table میں create ہوں۔

**Q: Service URL خود set ہو جاتا ہے؟**
A: ہاں! `/services/{page-slug}` خودکار ہے۔

**Q: Service کو delete کریں تو page delete ہو جائے گا؟**
A: نہیں! وہ الگ ہیں۔ Service delete کریں تو صرف service جاتی ہے، page رہتا ہے۔

**Q: Page update کریں تو service update ہوگی؟**
A: جی! ہر save پر service sync ہوتی ہے۔

---

## Code Changes

### AdminPageBuilder.jsx
```javascript
// Page save کے ساتھ service بھی save:
1. Check if service exists for this page URL
2. If exists: update service
3. If not: create new service
4. Status sync: published/draft → is_active true/false
```

### main.jsx
```javascript
// New route:
<Route path="services/:slug" element={<DynamicPageBuilder />} />
```

---

**بھی تیار ہو گئی! 🎉**

اب جب بھی admin نیا page بناتا ہے:
- ✅ Services میں automatically appear ہوتا ہے
- ✅ `/services/name` پر access ہوتا ہے
- ✅ Services Manager سے manage ہو سکتا ہے
