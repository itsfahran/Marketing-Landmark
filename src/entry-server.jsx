/**
 * Server-side entry point
 * Exported for Vite SSR build (vite build --ssr src/entry-server.jsx)
 *
 * Note: This file is currently not used in the Express setup (see server/render.js instead).
 * Keeping this for reference if you want to switch to renderToPipeableStream.
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { StaticRouterProvider, createStaticRouter } from 'react-router-dom';
import { routes } from './routes';

export async function render(url, context) {
  const router = createStaticRouter(routes, {
    location: url,
    basename: '/',
  });

  const helmetContext = {};

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouterProvider router={router} context={context}>
        <App />
      </StaticRouterProvider>
    </HelmetProvider>
  );

  return {
    html,
    helmetContext,
  };
}
