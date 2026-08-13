# ⚡ QUICK DIAGNOSTIC - 5 Minutes

## 🔍 Diagnose Why Scope Won't Save

**Do this RIGHT NOW:**

---

## **Step 1: Open Browser Console**

```
Press: F12

You should see Developer Tools open at bottom
```

---

## **Step 2: Go to Scope Form**

```
Admin → Pages → Edit Page
↓
Scroll to: "Fill Component Data"
↓
Find: SCOPE Component (should be GEO template)
```

---

## **Step 3: Try to Save Scope**

```
Change Heading to: "TEST"
Change Description to: "TEST TEST"
Click: [Save Scope]
```

---

## **Step 4: Check What Happens**

### **Option A: Alert Shows "Scope saved!"**
```
✓ Save function called
✓ Alert working
? But data might not be in database

→ Problem: Database connection or table doesn't exist
→ Check: Browser Console for database errors
```

### **Option B: No Alert Shows**
```
✓ Form working
? Save button might not be working

→ Problem: Save function not called
→ Check: Browser Console for JavaScript errors
```

### **Option C: Alert Shows Error**
```
❌ Error message visible
→ Problem: Database error
→ Read the error message
→ Screenshot it
→ Share with developer
```

---

## **Step 5: Check Browser Console**

```
Press: F12 (if not already open)
Click: "Console" tab
Look for: RED error messages

You should see one of:
❌ "Table 'component_scope' not found"
❌ "RLS policy violation"
❌ "Database connection failed"
❌ JavaScript error

Screenshot any RED messages
```

---

## **Step 6: Likely Cause**

| What happened | Likely Cause |
|---|---|
| Alert shows "saved" but data doesn't persist | Database table doesn't exist |
| No alert, form feels broken | JavaScript error in console |
| Error about "component_scope" | Table not created in Supabase |
| Error about "RLS" | Permissions issue |

---

## **Next: Fix Based on Error**

### **If "component_scope table not found":**

```
1. Open Supabase Dashboard
2. Go to: SQL Editor
3. Copy code from: COMPREHENSIVE_DB_SCHEMA.sql
4. Paste into SQL editor
5. Click: Run
6. Test again
```

### **If No Error Shows:**

```
1. Make sure page is saved first
   ├─ Click [Save Page] at top
   ├─ Wait for alert
   └─ Then try Scope

2. Check if page ID exists
   ├─ Edit page should have pageId
   ├─ If not, save page first
```

### **If JavaScript Error:**

```
1. Refresh page: Ctrl+R
2. Try again
3. Screenshot the error
4. Share with developer
```

---

## **🎯 TL;DR**

**Do this:**
1. F12 (open console)
2. Try to save Scope
3. Check console for errors
4. Share screenshot if error
5. Most likely: database table doesn't exist → run SQL schema

---

**Report back:**
- Did alert show? (Yes/No)
- What error in console? (Copy exact text)
- We can fix from there ✓

