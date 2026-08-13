import React, { useState, useEffect } from 'react';
import { FaBlog, FaBriefcase, FaEnvelope } from 'react-icons/fa';
import { fetchContactSubmissions, fetchBlogPosts, fetchPortfolioItems } from '@/lib/supabase-queries';
import '../../styles/admin-design-tokens.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    newSubmissions: 0,
    totalBlogPosts: 0,
    totalProjects: 0,
  });
  const [recentData, setRecentData] = useState({
    submissions: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [submissions, posts, projects] = await Promise.all([
        fetchContactSubmissions(),
        fetchBlogPosts('published'),
        fetchPortfolioItems('published'),
      ]);

      setStats({
        newSubmissions: submissions.filter(s => s.status === 'new').length,
        totalBlogPosts: posts.length,
        totalProjects: projects.length,
      });

      setRecentData({
        submissions: submissions.slice(0, 10),
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 'var(--spacing-3xl)' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)' }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--text-secondary)' }}>
          Overview of your website content
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-2xl)',
        }}
      >
        {/* Submissions Card */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            padding: 'var(--spacing-lg)',
            boxShadow: 'var(--shadow-xs)',
            transition: 'all var(--transition-fast)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-xs)')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-lg)' }}>
            <div>
              <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                New Submissions
              </p>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 'var(--spacing-xs)' }}>
                Contact form
              </p>
            </div>
            <div
              style={{
                backgroundColor: 'var(--primary-light)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FaEnvelope style={{ color: 'var(--primary)', fontSize: '18px' }} />
            </div>
          </div>
          <p style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {stats.newSubmissions}
          </p>
        </div>

        {/* Blog Posts Card */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            padding: 'var(--spacing-lg)',
            boxShadow: 'var(--shadow-xs)',
            transition: 'all var(--transition-fast)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-xs)')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-lg)' }}>
            <div>
              <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Blog Posts
              </p>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 'var(--spacing-xs)' }}>
                Published articles
              </p>
            </div>
            <div
              style={{
                backgroundColor: 'var(--success-light)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FaBlog style={{ color: 'var(--success)', fontSize: '18px' }} />
            </div>
          </div>
          <p style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {stats.totalBlogPosts}
          </p>
        </div>

        {/* Portfolio Card */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            padding: 'var(--spacing-lg)',
            boxShadow: 'var(--shadow-xs)',
            transition: 'all var(--transition-fast)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-xs)')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-lg)' }}>
            <div>
              <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Portfolio
              </p>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 'var(--spacing-xs)' }}>
                Projects
              </p>
            </div>
            <div
              style={{
                backgroundColor: 'var(--warning-light)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FaBriefcase style={{ color: 'var(--warning)', fontSize: '18px' }} />
            </div>
          </div>
          <p style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {stats.totalProjects}
          </p>
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-xs)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: 'var(--spacing-lg)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>
            Recent Submissions
          </h2>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginTop: 'var(--spacing-xs)' }}>
            Latest contact form entries
          </p>
        </div>

        {loading ? (
          <div style={{ padding: 'var(--spacing-3xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading...
          </div>
        ) : recentData.submissions.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
                  <th
                    style={{
                      padding: 'var(--spacing-lg)',
                      textAlign: 'left',
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      padding: 'var(--spacing-lg)',
                      textAlign: 'left',
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Email
                  </th>
                  <th
                    style={{
                      padding: 'var(--spacing-lg)',
                      textAlign: 'left',
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Service
                  </th>
                  <th
                    style={{
                      padding: 'var(--spacing-lg)',
                      textAlign: 'left',
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      padding: 'var(--spacing-lg)',
                      textAlign: 'left',
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentData.submissions.map((submission) => (
                  <tr
                    key={submission.id}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      transition: 'background-color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {submission.first_name} {submission.last_name}
                    </td>
                    <td style={{ padding: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                      {submission.email}
                    </td>
                    <td style={{ padding: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                      {submission.service_interested || '—'}
                    </td>
                    <td style={{ padding: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                      {new Date(submission.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: 'var(--spacing-lg)' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: 'var(--spacing-xs) var(--spacing-md)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: 'var(--font-size-xs)',
                          fontWeight: 600,
                          backgroundColor:
                            submission.status === 'new'
                              ? 'var(--success-light)'
                              : submission.status === 'contacted'
                              ? 'var(--info-light)'
                              : 'var(--background)',
                          color:
                            submission.status === 'new'
                              ? 'var(--success)'
                              : submission.status === 'contacted'
                              ? 'var(--info)'
                              : 'var(--text-secondary)',
                        }}
                      >
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: 'var(--spacing-3xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
            No submissions yet
          </div>
        )}
      </div>
    </div>
  );
}
