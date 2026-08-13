// ============================================================================
// ROUTING UPDATE EXAMPLE
// ============================================================================
// Add these routes to your application's route configuration
// This example shows how to integrate the Page Builder routes

import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Admin Page Builder Routes
import AdminPagesList from './src/Pages/Admin/AdminPagesList';
import AdminPageBuilder from './src/Pages/Admin/AdminPageBuilder';

// Public Page Builder Route
import DynamicPageBuilder from './src/Pages/DynamicPageBuilder';

// ============================================================================
// EXAMPLE 1: Using createBrowserRouter (React Router v7)
// ============================================================================

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },

  // ========================================================================
  // ADMIN ROUTES - Pages Management
  // ========================================================================
  {
    path: '/admin/pages',
    element: <AdminPagesList />,
    // Optionally add loader for pre-fetching pages
  },
  {
    path: '/admin/pages/new',
    element: <AdminPageBuilder />,
  },
  {
    path: '/admin/pages/:pageId',
    element: <AdminPageBuilder />,
    // Optionally add loader to fetch page data
  },

  // ========================================================================
  // PUBLIC ROUTES - View Built Pages
  // ========================================================================
  {
    path: '/page/:slug',
    element: <DynamicPageBuilder />,
    // This route handles all dynamically built pages
    // Example: /page/my-custom-page, /page/services-overview, etc.
  },

  // Catch-all 404 route
  {
    path: '*',
    element: <NotFound />,
  },
]);

// ============================================================================
// EXAMPLE 2: Using RouteConfig (if using createRoutesFromElements)
// ============================================================================

export const routes = (
  <>
    <Route path="/" element={<Home />} />

    {/* Admin Routes */}
    <Route path="/admin/pages" element={<AdminPagesList />} />
    <Route path="/admin/pages/new" element={<AdminPageBuilder />} />
    <Route path="/admin/pages/:pageId" element={<AdminPageBuilder />} />

    {/* Public Routes */}
    <Route path="/page/:slug" element={<DynamicPageBuilder />} />

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </>
);

// ============================================================================
// EXAMPLE 3: Nested Routes in Admin Section (More Organized)
// ============================================================================

export const adminRoutes = [
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'pages',
        element: <AdminPagesList />,
      },
      {
        path: 'pages/new',
        element: <AdminPageBuilder />,
      },
      {
        path: 'pages/:pageId',
        element: <AdminPageBuilder />,
      },
    ],
  },
];

// ============================================================================
// EXAMPLE 4: With Route Loaders (Data Fetching)
// ============================================================================

import { getSupabaseClient } from './src/lib/supabase';

// Loader for single page
export const pageLoader = async ({ params }) => {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', params.pageId)
    .single();

  if (error || !data) {
    throw new Response('Not Found', { status: 404 });
  }

  return { page: data };
};

// Loader for pages list
export const pagesListLoader = async () => {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Response('Error loading pages', { status: 500 });
  }

  return { pages: data };
};

// Routes with loaders
export const routesWithLoaders = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/admin/pages',
    element: <AdminPagesList />,
    loader: pagesListLoader,
  },
  {
    path: '/admin/pages/new',
    element: <AdminPageBuilder />,
  },
  {
    path: '/admin/pages/:pageId',
    element: <AdminPageBuilder />,
    loader: pageLoader,
  },
  {
    path: '/page/:slug',
    element: <DynamicPageBuilder />,
  },
]);

// ============================================================================
// NAVIGATION EXAMPLES
// ============================================================================

// Example: Add to Admin Navigation
export const AdminNavigation = () => {
  return (
    <nav className="admin-nav">
      <ul>
        <li>
          <Link to="/admin">Dashboard</Link>
        </li>
        <li>
          <Link to="/admin/pages">Pages</Link> {/* NEW - Page Builder */}
        </li>
        <li>
          <Link to="/admin/services">Services</Link> {/* Old system (soon to remove) */}
        </li>
        <li>
          <Link to="/admin/portfolio">Portfolio</Link>
        </li>
        {/* ... other admin sections ... */}
      </ul>
    </nav>
  );
};

// Example: Add to Main Navigation (link to visit pages)
export const MainNavigation = () => {
  return (
    <nav className="main-nav">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <a href="/page/my-services">Services</a> {/* Visit custom page */}
        </li>
        <li>
          <Link to="/portfolio">Portfolio</Link>
        </li>
      </ul>
    </nav>
  );
};

// ============================================================================
// MIGRATION FROM OLD SERVICE SYSTEM
// ============================================================================

/*
MIGRATION STEPS:

1. Create all page configurations using the new Page Builder
   - Go to /admin/pages/new
   - Create pages for each service (SEO, GEO, Local)
   - Save as draft to test

2. Test public pages
   - Visit /page/seo (or whatever slug you chose)
   - Verify all components render correctly

3. Publish pages
   - Once satisfied, publish from /admin/pages

4. Update links in navigation
   - Change links from old routes to /page/:slug
   - Update footer links
   - Update any internal links

5. Remove old service system
   - Delete old route handlers
   - Delete Services admin section
   - Delete old database tables (backup first!)
   - Remove old service components if replaced

BACKWARD COMPATIBILITY:
- Keep old routes working temporarily with redirects
- Redirect /seo → /page/seo
- Redirect /geo → /page/geo
- Redirect /local → /page/local

Example redirect:
{
  path: '/seo',
  element: <Navigate to="/page/seo" replace />,
}
*/
