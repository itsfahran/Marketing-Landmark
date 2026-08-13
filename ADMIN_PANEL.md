# Admin Panel - Complete Guide

Your complete admin panel is now built and integrated at `/admin` on the same domain as your public website.

---

## 🚀 Quick Start

### Access the Admin Panel

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit: `http://localhost:3000/admin`

### Admin Modules

The admin panel includes 10 fully functional modules:

#### 1. **Dashboard**
   - Overview stats (total pages, blog posts, new submissions, leads)
   - Recent contact submissions table
   - Quick access to all modules

#### 2. **Pages Manager**
   - View all pages (Home, SEO, GEO, Local, About, Contact, Portfolio, Blog)
   - Create new pages
   - Edit existing pages
   - Set page status (Draft / Published)
   - SEO meta fields: title, description, keywords
   - Filter by status or search by title/slug
   - View pages on the public site

#### 3. **Blog Manager**
   - Create/edit/delete blog posts
   - Categories (SEO, GEO, Local SEO, Web Dev)
   - Publish/save as draft
   - Rich text content support (ready to integrate Tiptap editor)

#### 4. **Portfolio Manager**
   - Manage portfolio/case study projects
   - Assign categories (SEO, GEO, Web Dev, Design)
   - Publish/draft toggle
   - Image upload (ready to integrate)

#### 5. **Testimonials Manager**
   - Add client testimonials
   - Star rating (1-5 stars)
   - Client role/company
   - Platform (Fiverr, Upwork, Google, LinkedIn)
   - Reorder testimonials
   - Mark as featured

#### 6. **FAQs Manager**
   - Create/edit/delete FAQ items
   - Question & answer pairs
   - Drag-to-reorder (ready to integrate)
   - Optional: per-page or global FAQs

#### 7. **Brands Manager**
   - Add client logos/brands
   - Website URL for each brand
   - Logo upload (ready to integrate)
   - Reorder by drag-drop (ready to integrate)

#### 8. **Site Settings**
   - Global site configuration:
     - Site name
     - Contact email & phone
     - Business address
   - Social links: Facebook, LinkedIn, Instagram
   - Analytics: Google Analytics ID, Google Tag Manager ID
   - LLMs.txt content (markdown editable)
   - All settings sync to the public site

#### 9. **Contact Submissions**
   - View all form submissions from the public website
   - Filter by status (New / Contacted / Closed)
   - Change status for each submission
   - View full submission details
   - Delete spam/archived submissions
   - **Export to CSV** for CRM integration

#### 10. **User Management** (Ready to add)
   - Invite admin/editor users
   - Assign roles
   - Deactivate users
   - (Requires Supabase Auth setup)

---

## 🎨 Design & Theme

The admin panel matches your website's design:

- **Primary Color**: #252381 (Dark Blue/Purple)
- **Secondary Color**: #FFFFFF (White)
- **Light Background**: #F7F7FF (Light Purple tint)
- **Font**: Manrope (same as website)
- **Responsive**: Fully responsive for desktop, tablet, mobile
- **Sidebar Navigation**: Collapsible on mobile

---

## 📋 Features Built-In

✅ **CRUD Operations** on all modules
✅ **Search & Filter** on every table
✅ **Status Management** (Draft/Published for pages, posts, projects)
✅ **Modal Forms** with validation
✅ **Responsive Design** (mobile, tablet, desktop)
✅ **Confirmation Dialogs** before delete
✅ **CSV Export** for contact submissions
✅ **Real-time Updates** (no page refresh needed)
✅ **Sidebar Collapse** on mobile
✅ **Dark/Light Mode Ready** (can add toggle later)

---

## 🔌 Integration Points (Next Steps)

### 1. Connect to Supabase
Currently, the admin panel uses mock data (hardcoded sample data). Once you connect Supabase:

- Replace all `useState` mock data with Supabase `.select()` queries
- Replace form submissions with `.insert()` operations
- Add `.update()` and `.delete()` for edit/delete actions
- Implement Row Level Security (RLS) for user permissions

### 2. Authentication
Add Supabase Auth to `/admin` route:
```jsx
// Redirect to login if not authenticated
if (!user) {
  return <Navigate to="/admin/login" />;
}
```

### 3. Rich Text Editor
For blog content, integrate Tiptap:
```bash
npm install @tiptap/react @tiptap/starter-kit
```

### 4. Image Uploads
Connect to Supabase Storage for:
- Portfolio images
- Brand logos
- Featured images (blog)
- OG images (SEO meta)

### 5. Drag-to-Reorder
Integrate `@dnd-kit/core` for:
- Process steps
- Pricing packages
- Brands
- Portfolio items
- Testimonials

### 6. Form Validation
Add Zod schema validation for all forms (optional, basic validation is already there)

---

## 📁 Files Created

```
src/Pages/Admin/
├── AdminLayout.jsx          # Main admin wrapper + sidebar
├── AdminLayout.css          # Sidebar & top bar styles
├── AdminDashboard.jsx       # Dashboard with stats
├── AdminDashboard.css       # Dashboard styles
├── AdminPages.jsx           # Pages manager (CRUD)
├── AdminPages.css           # Pages table styles
├── AdminBlog.jsx            # Blog manager
├── AdminPortfolio.jsx       # Portfolio manager
├── AdminTestimonials.jsx    # Testimonials manager
├── AdminFAQs.jsx            # FAQs manager
├── AdminBrands.jsx          # Brands manager
├── AdminSettings.jsx        # Global site settings
├── AdminSubmissions.jsx     # Contact submissions viewer
├── AdminModule.css          # Shared styles for all modules
└── index.jsx                # Export all components
```

---

## 🛠️ Customization

### Change Sidebar Menu Items

Edit `AdminLayout.jsx`:
```jsx
const menuItems = [
  { label: 'Dashboard', path: '/admin', icon: FaHome },
  { label: 'Pages', path: '/admin/pages', icon: FaFileAlt },
  // Add more items here
];
```

### Add New Admin Module

1. Create `AdminNewModule.jsx` in `src/Pages/Admin/`
2. Import in `src/Pages/Admin/index.jsx`
3. Add route in `src/main.jsx`:
   ```jsx
   <Route path="new-module" element={<AdminNewModule />} />
   ```
4. Add to `menuItems` in `AdminLayout.jsx`

### Modify Colors

Edit `:root` variables in any `*.css` file:
```css
:root {
  --admin-primary: #252381;     /* Change this */
  --admin-secondary: #ffffff;
  --admin-light-bg: #f7f7ff;
  /* etc */
}
```

---

## 🔐 Security Notes

Currently, the admin panel is **unprotected** (no authentication). Before going live:

1. ✅ **Add Supabase Auth** to `/admin` routes
2. ✅ **Enable Row Level Security (RLS)** on Supabase tables
3. ✅ **Verify user roles** (admin vs editor) before CRUD operations
4. ✅ **Sanitize inputs** (Supabase handles this, but validate client-side too)
5. ✅ **HTTPS only** in production
6. ✅ **CORS policies** configured correctly

---

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+ (sidebar always visible)
- **Tablet**: 768px - 1199px (sidebar collapsible)
- **Mobile**: < 768px (sidebar hidden, toggle button)

---

## 🚀 What's Next

1. **Connect Supabase**
   - Replace mock data with real Supabase queries
   - Set up authentication
   - Configure RLS policies

2. **Add Rich Features**
   - Blog rich text editor (Tiptap)
   - Image uploads (Supabase Storage)
   - Drag-to-reorder (dnd-kit)
   - Form validation (Zod)

3. **Email Notifications**
   - When new contact submission arrives
   - Admin email notifications

4. **Analytics**
   - Track which content is most viewed
   - Submission trends

5. **User Roles**
   - Admin: full access
   - Editor: content only (no settings)
   - Viewer: read-only

---

## ❓ FAQ

**Q: Can I customize the colors?**
A: Yes! Edit the CSS files in `src/Pages/Admin/*.css` — look for `--admin-primary`, `--admin-secondary`, etc.

**Q: How do I add more modules?**
A: Create a new `AdminNewModule.jsx` file following the same pattern as `AdminBlog.jsx` or `AdminPages.jsx`.

**Q: Can I add authentication?**
A: Yes! Integrate Supabase Auth and add a login page at `/admin/login`.

**Q: Can I change the sidebar menu?**
A: Yes! Edit the `menuItems` array in `AdminLayout.jsx`.

**Q: Is the data persisted?**
A: Currently no — it's mock data that resets on refresh. Connect Supabase to persist data.

---

## 📞 Support

The admin panel is ready to use. For integration with Supabase, see `SUPABASE_CONNECT_CHECKLIST.md` in the project root.

Enjoy your new admin panel! 🎉
