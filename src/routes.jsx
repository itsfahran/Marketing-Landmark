/**
 * Shared route configuration for both client and server
 * Used by:
 * - entry-client.jsx: createBrowserRouter
 * - entry-server.jsx: createStaticRouter
 *
 * This ensures the route structure is identical on both sides
 */

import {
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

import Layout from './Layout';
import Home from './Sections/Home/Home';
import About from './Pages/About/About';
import Portfolio from './Pages/Portfolio/Portfolio';
import Contact from './Pages/Contact/Contact';
import Blog from './Pages/Blog/Blog';
import NotFound from './Pages/NotFound';

// Loaders (imported for SSR, ignored on client hydration)
// The server uses these; the client hydrates from window.__staticRouterHydrationData__
import {
  loadPageBySlug,
  loadHomePage,
  loadBlogIndex,
  loadBlogPostBySlug,
  loadGlobalData,
} from './data/loaders';

/**
 * Create routes
 * Root Layout wraps all routes with Navbar/Outlet/Footer
 */
export const routes = createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    {/* Home page — special case, uses loadHomePage */}
    <Route
      index
      element={<Home />}
      loader={async () => {
        const [home, global] = await Promise.all([
          loadHomePage(),
          loadGlobalData(),
        ]);
        return { ...home, ...global };
      }}
    />

    {/* Dynamic route for any page slug /:slug - Placeholder; template selected per page.template_type */}
    <Route
      path=":slug"
      element={<Home />}
      loader={async ({ params }) => {
        const [page, global] = await Promise.all([
          loadPageBySlug(params.slug),
          loadGlobalData(),
        ]);

        if (!page) {
          return null; // Will 404
        }

        return { pageData: page, ...global };
      }}
    />

    {/* Blog index */}
    <Route
      path="blog"
      element={<Blog />}
      loader={async () => {
        const [blog, global] = await Promise.all([
          loadBlogIndex(),
          loadGlobalData(),
        ]);
        return { ...blog, ...global };
      }}
    />

    {/* Blog post detail */}
    <Route
      path="blog/:slug"
      element={<Blog />}
      loader={async ({ params }) => {
        const [post, global] = await Promise.all([
          loadBlogPostBySlug(params.slug),
          loadGlobalData(),
        ]);

        if (!post) {
          return null; // Will 404
        }

        return { post, ...global };
      }}
    />

    {/* 404 fallback */}
    <Route path="*" element={<NotFound />} />
  </Route>,
);

/**
 * Helper: Check if a component should receive loader data
 * Used in entry-server to determine which components expect data
 */
export function getLoaderForRoute(pathname) {
  if (pathname === '/') {
    return 'home';
  }
  if (pathname.startsWith('/blog/')) {
    return 'blogPost';
  }
  if (pathname === '/blog') {
    return 'blogIndex';
  }
  // Assume dynamic /:slug
  return 'page';
}
