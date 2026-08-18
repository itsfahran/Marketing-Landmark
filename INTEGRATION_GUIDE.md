# Supabase Integration Guide - BlogEditor & AdminPages

## Setup

### 1. Install Supabase Client
```bash
npm install @supabase/supabase-js
```

### 2. Environment Variables (.env)
```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Database Tables (Already Created)
✅ blog_posts
✅ blog_categories
✅ blog_authors
✅ blog_faqs
✅ blog_schema
✅ page_seo_keywords
✅ pages
✅ page_seo_metadata
✅ page_schema
✅ publishing_schedule

---

## BlogEditor Integration

### Step 1: Update BlogEditor.jsx Header

```jsx
import { useBlogEditor } from '../hooks/useBlogEditor';

export default function BlogEditor() {
  const {
    formData,
    categories,
    authors,
    faqs,
    keywords,
    loading,
    error,
    hasUnsavedChanges,
    lastSavedTime,
    updateFormData,
    saveDraft,
    publishPost,
    addFAQ,
    updateFAQ,
    deleteFAQ,
    addKeywords,
    calculateSEOScore
  } = useBlogEditor();

  return (
    <div className="blog-editor">
      {/* Header with save/publish buttons */}
    </div>
  );
}
```

### Step 2: Connect Basic Information Section

```jsx
const handleTitleChange = (e) => {
  const title = e.target.value;
  updateFormData('title', title);

  if (!formData.slugManuallyEdited) {
    const slug = generateSlug(title);
    updateFormData('slug', slug);
  }
};

const handleSlugChange = (e) => {
  updateFormData('slug', e.target.value);
  updateFormData('slugManuallyEdited', true);
};
```

### Step 3: Connect Category Selector

```jsx
const CategorySelector = ({ selected, onChange }) => {
  const { categories } = useBlogEditor();

  return (
    <select 
      value={selected} 
      onChange={(e) => onChange(e.target.value)}
      className="form-input"
    >
      <option value="">Select Category</option>
      {categories.map(cat => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  );
};
```

### Step 4: Connect Author Selector

```jsx
const AuthorSelector = ({ selected, onChange }) => {
  const { authors } = useBlogEditor();

  return (
    <select 
      value={selected} 
      onChange={(e) => onChange(e.target.value)}
      className="form-input"
    >
      <option value="">Select Author</option>
      {authors.map(author => (
        <option key={author.id} value={author.id}>
          {author.name}
        </option>
      ))}
    </select>
  );
};
```

### Step 5: Connect FAQ Builder

```jsx
const addFAQHandler = async (question, answer) => {
  try {
    await addFAQ(question, answer);
    // Show success message
  } catch (err) {
    // Handle error
  }
};

const updateFAQHandler = async (faqId, question, answer) => {
  try {
    await updateFAQ(faqId, question, answer);
    // Show success message
  } catch (err) {
    // Handle error
  }
};

const deleteFAQHandler = async (faqId) => {
  try {
    await deleteFAQ(faqId);
    // Show success message
  } catch (err) {
    // Handle error
  }
};
```

### Step 6: Connect Save & Publish

```jsx
const handleSaveDraft = async () => {
  try {
    const result = await saveDraft();
    showNotification('Draft saved successfully!', 'success');
    updateFormData('id', result.id); // Update with new ID if created
  } catch (err) {
    showNotification('Failed to save draft', 'error');
  }
};

const handlePublish = async () => {
  try {
    const result = await publishPost();
    showNotification('Post published successfully!', 'success');
    // Redirect to blog list or post view
  } catch (err) {
    showNotification('Failed to publish post', 'error');
  }
};
```

### Step 7: Connect SEO Settings

```jsx
const handleSEOUpdate = (field, value) => {
  updateFormData(field, value);
  
  // Real-time SEO score update
  const newScore = calculateSEOScore({
    ...formData,
    [field]: value
  });
  updateFormData('seo_score', newScore);
};
```

### Step 8: Connect SEO Analysis

```jsx
const SEOAnalysis = ({ formData, calculateSEOScore }) => {
  const score = formData.seo_score || 0;
  
  const checks = [
    {
      name: 'Meta Title',
      status: formData.meta_title?.length >= 30 && formData.meta_title?.length <= 60 ? 'pass' : 'fail',
      hint: 'Should be 30-60 characters'
    },
    {
      name: 'Meta Description',
      status: formData.meta_description?.length >= 120 && formData.meta_description?.length <= 160 ? 'pass' : 'fail',
      hint: 'Should be 120-160 characters'
    },
    {
      name: 'Focus Keyword in Title',
      status: formData.title?.toLowerCase().includes(formData.focus_keyword?.toLowerCase()) ? 'pass' : 'fail',
      hint: 'Include focus keyword in title'
    },
    {
      name: 'Alt Text',
      status: formData.featured_image_alt_text ? 'pass' : 'fail',
      hint: 'Add descriptive alt text to featured image'
    },
    {
      name: 'Content Length',
      status: formData.word_count >= 300 ? 'pass' : 'fail',
      hint: `${formData.word_count} words (minimum 300)`
    },
    {
      name: 'Canonical URL',
      status: formData.canonical_url ? 'pass' : 'fail',
      hint: 'Set canonical URL'
    }
  ];

  return (
    <div className="seo-analysis">
      <div className="seo-score">
        <h3>SEO Score: {score}/100</h3>
      </div>
      
      <div className="seo-checklist">
        {checks.map((check, idx) => (
          <div key={idx} className={`check ${check.status}`}>
            <span className="icon">{check.status === 'pass' ? '✓' : '✗'}</span>
            <div className="content">
              <p>{check.name}</p>
              <small>{check.hint}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## AdminPages Integration

### Step 1: Update AdminPages.jsx

```jsx
import { usePageEditor } from '../hooks/usePageEditor';

export default function AdminPages() {
  const {
    formData,
    seoMetadata,
    keywords,
    allPages,
    loading,
    error,
    hasUnsavedChanges,
    lastSavedTime,
    updateFormData,
    savePage,
    publishPage,
    deletePage,
    addKeywords,
    analyzeContent,
    calculateSEOScore,
    getPageOptions
  } = usePageEditor();

  return (
    <div className="admin-pages">
      {/* Page editor UI */}
    </div>
  );
}
```

### Step 2: List All Pages

```jsx
const PagesList = ({ pages, onEdit }) => {
  return (
    <div className="pages-list">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Slug</th>
            <th>Status</th>
            <th>SEO Score</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pages.map(page => (
            <tr key={page.id}>
              <td>{page.title}</td>
              <td>{page.slug}</td>
              <td>{page.status}</td>
              <td>
                <div className="seo-score-badge">{page.seo_score || 0}/100</div>
              </td>
              <td>
                <button onClick={() => onEdit(page.id)}>Edit</button>
                <button onClick={() => deletePage(page.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

### Step 3: Connect SEO Analysis for Pages

```jsx
const handleContentChange = async (htmlContent) => {
  updateFormData('content', htmlContent);
  
  // Analyze content for SEO
  const analysis = await analyzeContent(htmlContent);
  
  // Update score
  const newScore = calculateSEOScore(formData, analysis);
  updateFormData('seo_score', newScore);
};
```

### Step 4: Connect Save & Publish

```jsx
const handleSavePage = async () => {
  try {
    await savePage();
    showNotification('Page saved successfully!', 'success');
  } catch (err) {
    showNotification('Failed to save page', 'error');
  }
};

const handlePublishPage = async () => {
  try {
    await publishPage();
    showNotification('Page published successfully!', 'success');
  } catch (err) {
    showNotification('Failed to publish page', 'error');
  }
};
```

### Step 5: Real-time SEO Metadata Updates

```jsx
useEffect(() => {
  const updateTimer = setTimeout(async () => {
    if (formData.id && hasUnsavedChanges) {
      const newScore = calculateSEOScore(formData, seoMetadata);
      updateFormData('seo_score', newScore);
    }
  }, 2000); // Update after 2 seconds of inactivity

  return () => clearTimeout(updateTimer);
}, [formData, seoMetadata]);
```

---

## File Structure

```
src/
├── lib/
│   └── supabase.js           # Supabase client setup
├── hooks/
│   ├── useBlogEditor.js      # Blog editor hook with all CRUD operations
│   └── usePageEditor.js      # Page editor hook with SEO analysis
├── Pages/Admin/
│   ├── BlogEditor.jsx        # Update to use useBlogEditor hook
│   └── AdminPages.jsx        # Update to use usePageEditor hook
└── Components/
    └── ...
```

---

## API Operations Summary

### Blog Operations
- ✅ `getCategories()` - Fetch all categories
- ✅ `getAuthors()` - Fetch all active authors
- ✅ `getBlogPost(id)` - Fetch single post with relations
- ✅ `getBlogPosts(filters)` - List posts with filters
- ✅ `createBlogPost(data)` - Create new post
- ✅ `updateBlogPost(id, data)` - Update existing post
- ✅ `deleteBlogPost(id)` - Delete post
- ✅ `addFAQ(blogId, data)` - Add FAQ to post
- ✅ `updateFAQ(id, data)` - Update FAQ
- ✅ `deleteFAQ(id)` - Delete FAQ
- ✅ `addKeywords(blogId, keywords)` - Add SEO keywords
- ✅ `calculateSEOScore(data)` - Calculate SEO score

### Page Operations
- ✅ `getPages(filters)` - List pages with filters
- ✅ `getPage(id)` - Fetch single page with relations
- ✅ `createPage(data)` - Create new page
- ✅ `updatePage(id, data)` - Update existing page
- ✅ `updatePageSEOMetadata(id, data)` - Update SEO metadata
- ✅ `addKeywords(pageId, keywords)` - Add SEO keywords
- ✅ `analyzeContent(html)` - Analyze HTML content for SEO
- ✅ `calculateSEOScore(data, metadata)` - Calculate SEO score

---

## Testing Queries

Run these in Supabase SQL Editor to verify everything works:

```sql
-- Get all categories
SELECT * FROM blog_categories;

-- Get all authors
SELECT * FROM blog_authors;

-- Get sample blog post with FAQs
SELECT bp.*, 
  COUNT(DISTINCT bf.id) as faq_count
FROM blog_posts bp
LEFT JOIN blog_faqs bf ON bp.id = bf.blog_id
GROUP BY bp.id
LIMIT 1;

-- Get all pages with SEO scores
SELECT id, title, slug, seo_score, status
FROM pages
ORDER BY seo_score DESC;
```

---

## Checklist

1. ✅ Database tables created and configured
2. ✅ Supabase client setup in `src/lib/supabase.js`
3. ✅ Hooks created: `useBlogEditor.js` and `usePageEditor.js`
4. 🔲 Update `BlogEditor.jsx` to use `useBlogEditor` hook
5. 🔲 Update `AdminPages.jsx` to use `usePageEditor` hook
6. 🔲 Add error handling and toast notifications
7. 🔲 Test all CRUD operations
8. 🔲 Deploy to production with Supabase credentials
