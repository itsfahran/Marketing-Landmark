/**
 * Admin Services Manager
 * Create services by cloning templates (SEO, GEO, Local)
 * Connected to Supabase
 */

import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye, FaCopy } from 'react-icons/fa';
import {
  fetchAllPages,
  createPage,
  updatePage,
  deletePage,
  fetchPageHero,
  fetchPageStats,
  fetchPricingPackages,
  fetchPageScopeCards,
  createPageHero,
  updatePageHero,
  createPricingPackage,
  createPricingFeatures,
  fetchProcessSteps,
} from '../../lib/supabase-queries';
import './AdminPages.css';

export default function AdminPages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    template_type: 'seo',
    status: 'draft',
    meta_title: '',
    meta_description: '',
  });

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllPages();
      setPages(data || []);
    } catch (error) {
      console.error('Error loading pages:', error);
      setError('Database not connected yet. Set up Supabase migrations to continue.');
      setPages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingId) {
        // Update existing page
        const updated = await updatePage(editingId, formData);
        if (updated) {
          setPages(pages.map((p) => (p.id === editingId ? updated : p)));
          alert('Page updated successfully!');
        }
      } else {
        // Create new page
        const newPage = await createPage({
          ...formData,
          created_at: new Date().toISOString(),
        });
        if (newPage) {
          setPages([...pages, newPage]);
          alert('Page created successfully!');
        }
      }
      resetForm();
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Error saving page. Check console for details.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (page) => {
    setFormData(page);
    setEditingId(page.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this page?')) {
      try {
        const success = await deletePage(id);
        if (success) {
          setPages(pages.filter((p) => p.id !== id));
          alert('Page deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting page:', error);
        alert('Error deleting page.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      template_type: 'seo',
      status: 'draft',
      meta_title: '',
      meta_description: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || page.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="admin-pages">
        <div className="pages-header">
          <h2 className="page-heading">Manage Pages</h2>
        </div>
        <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Loading pages from Supabase...
        </p>
      </div>
    );
  }

  return (
    <div className="admin-pages">
      <div className="pages-header">
        <h2 className="page-heading">Manage Pages</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)} disabled={saving || !!error}>
          <FaPlus /> New Page
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          color: '#856404',
          padding: '12px 16px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <strong>⚠️ Setup Required:</strong> {error}
        </div>
      )}

      {/* Search & Filter */}
      <div className="pages-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <label>Filter:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Pages</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Pages Table */}
      {filteredPages.length > 0 ? (
        <div className="pages-table">
          <div className="table-header">
            <div className="col-title">Title</div>
            <div className="col-slug">Slug</div>
            <div className="col-template">Template</div>
            <div className="col-status">Status</div>
            <div className="col-actions">Actions</div>
          </div>

          {filteredPages.map((page) => (
            <div key={page.id} className="table-row">
              <div className="col-title">
                <strong>{page.title}</strong>
              </div>
              <div className="col-slug">
                <code>/{page.slug}</code>
              </div>
              <div className="col-template">
                <span className="badge">{page.template_type}</span>
              </div>
              <div className="col-status">
                <span className={`status ${page.status}`}>{page.status}</span>
              </div>
              <div className="col-actions">
                <button
                  className="action-btn view"
                  title="View"
                  onClick={() => window.open(`/${page.slug}`, '_blank')}
                >
                  <FaEye />
                </button>
                <button className="action-btn edit" title="Edit" onClick={() => handleEdit(page)}>
                  <FaEdit />
                </button>
                <button
                  className="action-btn delete"
                  title="Delete"
                  onClick={() => handleDelete(page.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-data">No pages found</p>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? 'Edit Page' : 'Create New Page'}</h3>

            <form onSubmit={handleSubmit} className="page-form">
              <div className="form-group">
                <label>Page Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., SEO Services"
                />
              </div>

              <div className="form-group">
                <label>URL Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., seo"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Template Type *</label>
                  <select name="template_type" value={formData.template_type} onChange={handleInputChange}>
                    <option value="seo">SEO</option>
                    <option value="geo">GEO</option>
                    <option value="local">Local SEO</option>
                    <option value="static">Static Page</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Meta Title</label>
                <input
                  type="text"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleInputChange}
                  placeholder="SEO meta title"
                  maxLength={60}
                />
              </div>

              <div className="form-group">
                <label>Meta Description</label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleInputChange}
                  placeholder="SEO meta description"
                  rows="3"
                  maxLength={160}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update Page' : 'Create Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
