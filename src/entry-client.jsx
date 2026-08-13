/**
 * Client-side entry point
 * Hydrates the server-rendered HTML and bootstraps the React app with router
 */

import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { routes } from './routes';

// Hydrate the app with the server-rendered HTML
const router = createBrowserRouter(routes, {
  hydrationData: window.__staticRouterHydrationData__,
});

hydrateRoot(
  document.getElementById('root'),
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>
);
