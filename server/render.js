/**
 * Server-side render function
 * Renders the React app on the server and returns HTML with injected data
 */

import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { StaticRouterProvider, createStaticRouter, createStaticHandler } from 'react-router-dom';
import { routes } from '../src/routes.jsx';
import { App } from '../src/App.jsx';

const isProd = process.env.NODE_ENV === 'production';

/**
 * Render the page for a given URL
 * @param {string} url - Request URL (e.g. '/seo' or '/blog/my-post')
 * @returns {string|null} HTML string, or null for 404
 */
export async function renderPage(url) {
  try {
    // Create router handler
    const handler = createStaticHandler(routes);

    // Get matched route and loader data
    const fetchRequest = new Request(`http://localhost:${process.env.PORT || 3000}${url}`);
    const context = await handler.query(fetchRequest);

    // Check for 404 (no match)
    if (context instanceof Response && context.status === 404) {
      return null;
    }

    // Get the data from loader (router passes it via loaderData)
    const loaderData = context.loaderData || {};

    // Create static router with hydration data
    const router = createStaticRouter(routes, {
      location: new URL(url, 'http://localhost').pathname,
      basename: '/',
    });

    // Helmet context for SSR
    const helmetContext = {};

    // Render to string
    const html = renderToString(
      <HelmetProvider context={helmetContext}>
        <StaticRouterProvider router={router} context={context}>
          <App />
        </StaticRouterProvider>
      </HelmetProvider>
    );

    // Extract helmet data
    const { helmet } = helmetContext;
    const headTags = helmet
      ? `${helmet.title.toString()}
         ${helmet.meta.toString()}
         ${helmet.link.toString()}
         ${helmet.script.toString()}`
      : '';

    // Inject into HTML template
    const injectedHtml = getHtmlTemplate()
      .replace('<!--app-head-->', headTags)
      .replace('<!--app-html-->', html)
      .replace(
        '</head>',
        `
        <script>
          window.__staticRouterHydrationData__ = ${JSON.stringify(loaderData)};
        </script>
        </head>
        `
      );

    return injectedHtml;
  } catch (error) {
    console.error('Render error:', error);
    if (isProd) {
      return null; // Fail silently in prod
    }
    throw error; // Re-throw in dev for debugging
  }
}

/**
 * Load and cache HTML template
 */
let htmlTemplate = null;

function getHtmlTemplate() {
  if (htmlTemplate) return htmlTemplate;

  // In production: load from dist/client/index.html
  // In development: read from project root
  const templatePath = isProd
    ? './dist/client/index.html'
    : './index.html';

  try {
    htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
  } catch (err) {
    console.error(`Failed to read HTML template at ${templatePath}:`, err);
    htmlTemplate = getDefaultTemplate();
  }

  return htmlTemplate;
}

/**
 * Fallback template if index.html can't be read
 */
function getDefaultTemplate() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <!--app-head-->
    </head>
    <body>
      <div id="root"><!--app-html--></div>
      <script type="module" src="/src/entry-client.jsx"><\/script>
    </body>
    </html>
  `;
}

import fs from 'fs';
