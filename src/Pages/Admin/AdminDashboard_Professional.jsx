import React, { useState, useEffect } from 'react';
import { FaBlog, FaBriefcase, FaEnvelope, FaUsers, FaStar, FaLink, FaChartLine, FaClock } from 'react-icons/fa';
import { fetchContactSubmissions, fetchBlogPosts, fetchPortfolioItems, fetchTestimonials, fetchNavbarMenuItems, fetchServices } from '../../lib/supabase-queries';
import '../../styles/admin-professional.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    newSubmissions: 0,
    totalBlogPosts: 0,
    totalProjects: 0,
    totalTestimonials: 0,
    totalNavbarItems: 0,
    totalServices: 0,
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [submissions, posts, projects, testimonials, navbar, services] = await Promise.all([
        fetchContactSubmissions(),
        fetchBlogPosts('published'),
        fetchPortfolioItems('published'),
        fetchTestimonials(),
        fetchNavbarMenuItems(),
        fetchServices(),
      ]);

      setStats({
        newSubmissions: submissions.filter(s => s.status === 'new').length,
        totalBlogPosts: posts.length,
        totalProjects: projects.length,
        totalTestimonials: testimonials.length,
        totalNavbarItems: navbar.length,
        totalServices: services.length,
      });

      setRecentSubmissions(submissions.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 'var(--admin-spacing-2xl)' }}>
        <div className="admin-loading-spinner"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'New Submissions',
      value: stats.newSubmissions,
      icon: FaEnvelope,
      color: '#ef4444',
      bgColor: '#fef2f2',
      link: '/admin/contact-submissions',
    },
    {
      title: 'Blog Posts',
      value: stats.totalBlogPosts,
      icon: FaBlog,
      color: '#3b82f6',
      bgColor: '#eff6ff',
      link: '/admin/blog-manager',
    },
    {
      title: 'Portfolio Items',
      value: stats.totalProjects,
      icon: FaBriefcase,
      color: '#10b981',
      bgColor: '#ecfdf5',
      link: '/admin/portfolio-page',
    },
    {
      title: 'Testimonials',
      value: stats.totalTestimonials,
      icon: FaStar,
      color: '#f59e0b',
      bgColor: '#fffbeb',
      link: '/admin/testimonials-manager',
    },
    {
      title: 'Services',
      value: stats.totalServices,
      icon: FaLink,
      color: '#8b5cf6',
      bgColor: '#faf5ff',
      link: '/admin/services-manager',
    },
    {
      title: 'Navbar Items',
      value: stats.totalNavbarItems,
      icon: FaChartLine,
      color: '#06b6d4',
      bgColor: '#ecfdf5',
      link: '/admin/navbar-manager',
    },
  ];

  return (
    <div style={{ padding: 'var(--admin-spacing-2xl)' }}>
      {/* Page Header */}
      <div className="admin-page-header" style={{ marginBottom: 'var(--admin-spacing-3xl)' }}>
        <div>
          <h1 style={{ marginBottom: 'var(--admin-spacing-sm)' }}>Dashboard</h1>
          <p style={{ margin: 0, color: 'var(--admin-gray-600)' }}>
            Welcome back! Here's an overview of your website.
          </p>
        </div>
        <div style={{ textAlign: 'right', color: 'var(--admin-gray-500)', fontSize: 'var(--admin-font-size-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-spacing-sm)' }}>
            <FaClock size={16} />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="admin-grid-3" style={{ marginBottom: 'var(--admin-spacing-3xl)' }}>
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="admin-card"
              style={{
                cursor: 'pointer',
                transition: 'all var(--admin-transition-base)',
              }}
              onClick={() => window.location.href = stat.link}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--admin-shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--admin-shadow-xs)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{
                    fontSize: 'var(--admin-font-size-sm)',
                    fontWeight: 600,
                    color: 'var(--admin-gray-600)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    margin: '0 0 var(--admin-spacing-md) 0',
                  }}>
                    {stat.title}
                  </p>
                  <p style={{
                    fontSize: 'var(--admin-font-size-3xl)',
                    fontWeight: 700,
                    color: stat.color,
                    margin: 0,
                  }}>
                    {stat.value}
                  </p>
                </div>
                <div style={{
                  backgroundColor: stat.bgColor,
                  padding: 'var(--admin-spacing-lg)',
                  borderRadius: 'var(--admin-radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon style={{ fontSize: 'var(--admin-font-size-2xl)', color: stat.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Submissions */}
      <div className="admin-card" style={{ marginBottom: 'var(--admin-spacing-2xl)' }}>
        <div className="admin-card-header">
          <h3 className="admin-card-title">Recent Contact Submissions</h3>
          <a href="/admin/contact-submissions" style={{
            fontSize: 'var(--admin-font-size-sm)',
            color: 'var(--admin-accent)',
            textDecoration: 'none',
            fontWeight: 600,
          }}>
            View all →
          </a>
        </div>
        <div className="admin-card-body">
          {recentSubmissions.length > 0 ? (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.map((submission, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600, color: 'var(--admin-primary)' }}>
                        {submission.first_name} {submission.last_name}
                      </td>
                      <td style={{ color: 'var(--admin-gray-600)' }}>
                        {submission.email}
                      </td>
                      <td>{submission.service_interested || '-'}</td>
                      <td>
                        <span className={`admin-badge admin-badge-${submission.status === 'new' ? 'warning' : submission.status === 'contacted' ? 'info' : 'success'}`}>
                          {submission.status || 'new'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--admin-gray-500)', fontSize: 'var(--admin-font-size-sm)' }}>
                        {new Date(submission.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: 'var(--admin-gray-500)', textAlign: 'center', margin: 0 }}>
              No submissions yet
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Quick Actions</h3>
        </div>
        <div className="admin-card-body">
          <div className="admin-flex" style={{ display: 'flex', flexWrap: 'wrap' }}>
            <a href="/admin/pages/new" className="admin-btn admin-btn-primary">
              + New Page
            </a>
            <a href="/admin/services-manager" className="admin-btn admin-btn-secondary">
              Manage Services
            </a>
            <a href="/admin/blog-manager" className="admin-btn admin-btn-secondary">
              Add Blog Post
            </a>
            <a href="/admin/testimonials-manager" className="admin-btn admin-btn-secondary">
              Add Testimonial
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
