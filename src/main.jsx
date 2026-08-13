import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Layout from "./Layout.jsx";
import Home from "./Sections/Home/Home.jsx";
import About from "./Pages/About/About.jsx";
import Portfolio from "./Pages/Portfolio/Portfolio.jsx";
import Contact from "./Pages/Contact/Contact.jsx";
import Blog from "./Pages/Blog/Blog.jsx";

// Admin components
import {
  AdminLayout,
  AdminDashboard,
  AdminBlog,
  AdminPortfolio,
  AdminTestimonials,
  AdminFAQs,
  AdminBrands,
  AdminSettings,
  AdminSubmissions,
} from "./Pages/Admin/index.jsx";
import AdminHomeComponents from "./Pages/Admin/AdminHomeComponents.jsx";
import AdminAboutPage from "./Pages/Admin/AdminAboutPage.jsx";
import AdminPortfolioPage from "./Pages/Admin/AdminPortfolioPage.jsx";
import AdminContactSubmissions from "./Pages/Admin/AdminContactSubmissions.jsx";
import AdminBlogManager from "./Pages/Admin/AdminBlogManager.jsx";
import AdminPagesList from "./Pages/Admin/AdminPagesList.jsx";
import AdminPageBuilder from "./Pages/Admin/AdminPageBuilder.jsx";
import DynamicPageBuilder from "./Pages/DynamicPageBuilder.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public routes */}
      <Route path="/" element={<Layout />}>
        <Route path="" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="contact" element={<Contact />} />
        <Route path="page/:slug" element={<DynamicPageBuilder />} />
        <Route path="blog" element={<Blog />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="home-components" element={<AdminHomeComponents />} />
        <Route path="about-page" element={<AdminAboutPage />} />
        <Route path="portfolio-page" element={<AdminPortfolioPage />} />
        <Route path="contact-submissions" element={<AdminContactSubmissions />} />
        <Route path="blog-manager" element={<AdminBlogManager />} />
        <Route path="pages" element={<AdminPagesList />} />
        <Route path="pages/new" element={<AdminPageBuilder />} />
        <Route path="pages/:pageId" element={<AdminPageBuilder />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="portfolio" element={<AdminPortfolio />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="faqs" element={<AdminFAQs />} />
        <Route path="brands" element={<AdminBrands />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="submissions" element={<AdminSubmissions />} />
      </Route>
    </>
  ),
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </StrictMode>,
);
