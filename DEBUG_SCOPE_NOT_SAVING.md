# 🔧 DEBUG: Scope Heading/Description Not Saving

## 🚨 Problem
When you change Scope heading/description and click "Save Scope", nothing happens (or appears to work but doesn't persist).

---

## 🔍 Step-by-Step Debugging

### **Step 1: Check Browser Console for Errors**

1. Open Developer Tools: `F12`
2. Go to: **Console** tab
3. Look for any RED error messages
4. Take a screenshot if you see errors
5. Share with developer

**Common errors might look like:**
```
❌ Error: "component_scope" table not found
❌ Error: RLS policy violation
❌ Error: Failed to fetch from database
❌ Error: Invalid data format
```

---

### **Step 2: Verify Database Tables Exist**

**Check if Supabase has the tables:**

1. Login to: Supabase Dashboard
2. Go to: **SQL Editor**
3. Run this query:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name LIKE 'component_%'
   ORDER BY table_name;
   ```
4. Look for these tables in results:
   - ✓ `component_scope` ← Must exist
   - ✓ `component_hero` ← For comparison
   - ✓ `component_pricing`
   - ✓ `component_process`

**If tables don't exist:**
→ See "Fix 1: Deploy Database Schema" below

---

### **Step 3: Test Hero Component**

Hero is working, so use it as comparison:

1. Edit a page
2. Change Hero heading/description
3. Click **[Save Hero]**
4. Does it show alert? **"Hero saved!"**
5. If YES → Alert system works
6. If NO → Different issue

---

### **Step 4: Test Scope Component**

1. Edit same page
2. Change Scope heading to: **"TEST HEADING"**
3. Change Scope description to: **"TEST DESCRIPTION"**
4. Click **[Save Scope]**
5. Check:
   - Does alert show? **"Scope saved!"**
   - Does data reload? (fields reset)
   - Does it appear in database?

**If alert shows but data doesn't persist:**
→ Issue is with database save (Fix 2 or 3)

**If alert doesn't show:**
→ Issue is with the form or save button (Fix 4)

---

## 🛠️ Fixes

### **Fix 1: Deploy Database Schema** (Most Likely)

**If tables don't exist in Supabase:**

1. Open Supabase Dashboard
2. Go to: **SQL Editor**
3. Click: **+ New Query**
4. Copy schema from: `COMPREHENSIVE_DB_SCHEMA.sql`
5. Paste into query editor
6. Click: **▶ Run**
7. Wait for completion
8. Check results (should show "executed successfully")

**Expected output:**
```
Created table component_hero ✓
Created table component_scope ✓
Created table component_pricing ✓
Created table component_process ✓
... (all tables)
```

**Then test again:**
1. Go back to admin
2. Edit page
3. Try saving Scope data again
4. Should work now ✓

---

### **Fix 2: Check RLS Policies**

**If tables exist but data won't save:**

1. Supabase Dashboard → **Authentication** → **Policies**
2. For each table, verify policies allow:
   - ✓ SELECT (read)
   - ✓ INSERT (create)
   - ✓ UPDATE (modify)
   - ✓ DELETE (remove)

3. If policies too restrictive → Disable RLS:
   - Click table name
   - Go to: **RLS** section
   - Click: **Disable RLS** (if showing "Enabled")
   - Confirm

4. Test saving again

---

### **Fix 3: Check Page is Saved First**

**You must save the page BEFORE saving component data:**

1. Page name filled? ✓
2. Page slug filled? ✓
3. Click: **[Save Page]** (top button)
4. Wait for success alert
5. THEN fill component data and save

**Error if you don't:**
```
"Please save page first"
```

---

### **Fix 4: Check Form Data is Loaded**

**If data fields are empty:**

1. Edit page
2. Scroll to **"Fill Component Data"**
3. Check if Scope fields show data:
   - Heading field: Should show text (if previously saved)
   - Description field: Should show text

4. If empty: Data never saved before (normal for new pages)
5. Try entering test data and saving

---

## 🧪 Complete Test Scenario

**Follow this exact sequence:**

```
1. Login to Admin → Pages
   
2. Create New Page
   ├─ Name: "Test Page"
   ├─ Slug: "test-page"
   └─ [Save Page] ← Wait for alert

3. Select Components
   ├─ ☑️ Hero (SEO)
   ├─ ☑️ Scope (GEO)
   └─ ☑️ Pricing (LOCAL)

4. Fill Hero (Control Group)
   ├─ Heading: "Hero Test"
   ├─ Description: "Hero works"
   ├─ [Save Hero]
   └─ Alert shows? ✓

5. Fill Scope (Test Group)
   ├─ Heading: "Scope Test"
   ├─ Description: "Scope test"
   ├─ [Save Scope]
   ├─ Alert shows? ✓
   └─ Check Browser Console ← For errors

6. Publish Page
   └─ [Publish Page]

7. View Public Page
   ├─ Go to: /test-page
   ├─ Does Scope heading show "Scope Test"? ✓
   └─ Does Scope description show? ✓
```

**If this works:** Everything is fine, use this flow for all components

**If this fails at step 5:** Check console for specific error message

---

## 📋 Checklist to Provide Developer

If still not working, share:

- [ ] Browser console screenshot (F12 → Console)
- [ ] Supabase query result (does component_scope table exist?)
- [ ] Alert text when clicking "Save Scope"
- [ ] Page name and slug
- [ ] Whether Hero works but Scope doesn't
- [ ] Supabase project URL
- [ ] Which template (SEO, GEO, LOCAL) for Scope?

---

## 🆘 Common Issues & Solutions

### **Issue: "Please save page first"**
**Solution:** Click [Save Page] button at the top before saving components

### **Issue: Alert shows but data doesn't persist**
**Solution:** Check browser console, likely database issue (table doesn't exist or RLS blocking)

### **Issue: No alert shows at all**
**Solution:** Check form fields are filled, refresh page, check console for JavaScript errors

### **Issue: Fields are empty when loading page**
**Solution:** Data hasn't been saved yet (new component). Start entering data.

### **Issue: Data saves but doesn't show on public page**
**Solution:** Make sure page is PUBLISHED (not Draft), hard refresh public page (Ctrl+Shift+R)

---

## 📞 If Still Stuck

**Run this test and share results:**

1. Open browser console (F12)
2. Run this command:
   ```javascript
   console.log('Page ID:', window.location.pathname);
   console.log('Time:', new Date().toISOString());
   ```
3. Try to save Scope data
4. Copy entire console output
5. Screenshot and share with developer

---

## ✅ Quick Checklist

Before contacting support, verify:

- [ ] Database tables exist (checked in Supabase)
- [ ] Page is saved first (clicked [Save Page])
- [ ] Component is enabled (☑️ Scope)
- [ ] Form fields have data
- [ ] Clicked [Save Scope] button
- [ ] Checked browser console (F12)
- [ ] Tried refreshing page
- [ ] Tried different template (SEO, GEO, LOCAL)

---

## 🎯 Expected Behavior

```
When clicking [Save Scope]:

1. Form fields disable (grayed out)
2. Alert shows: "Scope saved!"
3. Form fields enable again
4. Data persists in database
5. On page reload, data still there
6. On public page, data displays
```

If any step doesn't happen → Issue identified

---

**Need more help? Check the console first, then share the error message!** 🚀

