/**
 * Admin Pages Manager - Enhanced with SEO Settings & Analysis
 * Create and manage pages with complete SEO configuration
 * Connected to Supabase
 */

import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye, FaCopy, FaChevronDown, FaChevronUp, FaCheck, FaExclamationTriangle, FaFileAlt } from 'react-icons/fa';
import { usePageEditor } from '../../hooks/usePageEditor';
import SEOScoreDisplay from '../../Components/Admin/SEOScoreDisplay';
import ToastNotification from '../../Components/Admin/ToastNotification';
import ContentStats from '../../Components/Admin/ContentStats';
import DataSelector from '../../Components/Admin/DataSelector';
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

// SEO Analysis Helper
const calculateSEOScore = (formData) => {
  let score = 0;
  const checks = {
    seoTitle: false,
    metaDescription: false,
    seoFriendlySlug: false,
    canonicalUrl: false,
    ogTitle: false,
    ogDescription: false,
  };

  if (formData.meta_title && formData.meta_title.length > 30 && formData.meta_title.length <= 60) {
    score += 15;
    checks.seoTitle = true;
  } else if (formData.meta_title && formData.meta_title.length > 0) {
    score += 10;
    checks.seoTitle = true;
  }

  if (formData.meta_description && formData.meta_description.length > 120 && formData.meta_description.length <= 160) {
    score += 15;
    checks.metaDescription = true;
  } else if (formData.meta_description && formData.meta_description.length > 0) {
    score += 10;
    checks.metaDescription = true;
  }

  if (formData.slug && /^[a-z0-9\-]+$/.test(formData.slug)) {
    score += 15;
    checks.seoFriendlySlug = true;
  }

  if (formData.canonical_url && formData.canonical_url.length > 0) {
    score += 10;
    checks.canonicalUrl = true;
  }

  if (formData.og_title && formData.og_title.length > 0) {
    score += 15;
    checks.ogTitle = true;
  }

  if (formData.og_description && formData.og_description.length > 0) {
    score += 15;
    checks.ogDescription = true;
  }

  return { score: Math.min(score, 100), checks };
};

export default function AdminPages() {
  // Use Supabase page editor hook
  const {
    formData,
    seoMetadata,
    allPages,
    loading,
    error,
    hasUnsavedChanges,
    updateFormData,
    savePage,
    publishPage,
    deletePage: deletePageHook,
    analyzeContent,
    calculateSEOScore: calculateSEOScoreHook,
    getPageOptions
  } = usePageEditor();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    seoBasic: true,
    seoSocial: true,
    seoAdvanced: false,
    visibility: true,
  });
  const [notification, setNotification] = useState(null);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateFormData(name, type === 'checkbox' ? checked : value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingId) {
        await savePage();
        showNotification('Page updated successfully!', 'success');
      } else {
        await savePage();
        showNotification('Page created successfully!', 'success');
      }
      resetForm();
    } catch (error) {
      console.error('Error saving page:', error);
      showNotification('Error saving page: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (page) => {
    updateFormData('id', page.id);
    updateFormData('title', page.title);
    updateFormData('slug', page.slug);
    updateFormData('template_type', page.template_type);
    updateFormData('status', page.status);
    updateFormData('meta_title', page.meta_title);
    updateFormData('meta_description', page.meta_description);
    updateFormData('canonical_url', page.canonical_url);
    updateFormData('og_title', page.og_title);
    updateFormData('og_description', page.og_description);
    updateFormData('focus_keyword', page.focus_keyword);
    setEditingId(page.id);
    setShowForm(true);
    setActiveTab('basic');
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this page?')) {
      try {
        await deletePageHook();
        showNotification('Page deleted successfully!', 'success');
        resetForm();
      } catch (error) {
        console.error('Error deleting page:', error);
        showNotification('Error deleting page: ' + error.message, 'error');
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const filteredPages = (allPages || []).filter((page) => {
    const matchesSearch =
      page.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug?.toLowerCase().includes(searchTerm.toLowerCase());
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
      {notification && (
        <div className={`notification notification-${notification.type}`} style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '15px 20px',
          borderRadius: '4px',
          backgroundColor: notification.type === 'success' ? '#4CAF50' : notification.type === 'error' ? '#f44336' : '#2196F3',
          color: 'white',
          zIndex: 9999,
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}>
          {notification.message}
        </div>
      )}
      <div className="pages-header">
        <h2 className="page-heading">Manage Pages</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)} disabled={saving || !!error}>
          <FaPlus /> New Page
        </button>
      </div>

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

      {/* Enhanced Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Page' : 'Create New Page'}</h3>
              <button className="modal-close" onClick={resetForm}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="page-form-enhanced">
              {/* SEO Score Bar */}
              <div className="seo-score-bar">
                <div className="score-info">
                  <span className="score-label">SEO Score</span>
                  <span className={`score-value ${seoScore >= 70 ? 'good' : seoScore >= 50 ? 'ok' : 'poor'}`}>
                    {seoScore}/100
                  </span>
                </div>
                <div className="score-progress">
                  <div className="progress-bar" style={{ width: `${seoScore}%` }}></div>
                </div>
              </div>

              {/* Basic Information Section */}
              <div className="form-section">
                <div className="section-header" onClick={() => toggleSection('basicInfo')}>
                  <h4>📋 Basic Information</h4>
                  {expandedSections.basicInfo ? <FaChevronUp /> : <FaChevronDown />}
                </div>

                {expandedSections.basicInfo && (
                  <div className="section-content">
                    <div className="form-group">
                      <label>Page Name *</label>
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
                        placeholder="e.g., seo-services"
                      />
                      <small>URL-friendly format: lowercase, hyphens only</small>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Parent Page</label>
                        <select name="parent_id" value={formData.parent_id || ''} onChange={handleInputChange}>
                          <option value="">No Parent</option>
                          {pages.map((p) => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Template/Layout *</label>
                        <select name="template_type" value={formData.template_type} onChange={handleInputChange}>
                          <option value="seo">SEO</option>
                          <option value="geo">GEO</option>
                          <option value="local">Local SEO</option>
                          <option value="static">Static Page</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Status</label>
                        <select name="status" value={formData.status} onChange={handleInputChange}>
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SEO Score Display */}
              <div className="form-section">
                <SEOScoreDisplay
                  score={formData.seo_score || 0}
                  data={formData}
                />
              </div>

              {/* Content Stats */}
              <div className="form-section">
                <ContentStats
                  wordCount={formData.word_count || 0}
                  readingTime={formData.reading_time_minutes || 0}
                  viewCount={formData.view_count || 0}
                  status={formData.status}
                />
              </div>

              {/* Content Section */}
              <div className="form-section">
                <div className="section-header">
                  <h4>🖼️ Content</h4>
                </div>
                <div className="section-content">
                  <p style={{ color: '#666', fontSize: '14px' }}>
                    Use the page builder to manage sections, images, and content layout. This will be implemented in the next phase.
                  </p>
                </div>
              </div>

              {/* SEO Settings - Basic */}
              <div className="form-section">
                <div className="section-header" onClick={() => toggleSection('seoBasic')}>
                  <h4>🔍 SEO Settings - Basic</h4>
                  {expandedSections.seoBasic ? <FaChevronUp /> : <FaChevronDown />}
                </div>

                {expandedSections.seoBasic && (
                  <div className="section-content">
                    {/* Focus Keyword */}
                    <div className="form-group">
                      <label>Focus Keyword</label>
                      <input
                        type="text"
                        name="focus_keyword"
                        value={formData.focus_keyword || ''}
                        onChange={handleInputChange}
                        placeholder="e.g., SEO services Pakistan"
                      />
                      <small>The main keyword you want to rank for (1-3 words)</small>
                    </div>

                    {/* SEO Title */}
                    <div className="form-group">
                      <label>SEO Title <span className="char-count">{(formData.meta_title || '').length}/60</span></label>
                      <input
                        type="text"
                        name="meta_title"
                        value={formData.meta_title || ''}
                        onChange={handleInputChange}
                        placeholder="Enter SEO title (30-60 characters)"
                        maxLength={60}
                      />
                      <small>Recommended: 30-60 characters. Include focus keyword if possible.</small>
                    </div>

                    {/* Meta Description */}
                    <div className="form-group">
                      <label>Meta Description <span className="char-count">{(formData.meta_description || '').length}/160</span></label>
                      <textarea
                        name="meta_description"
                        value={formData.meta_description}
                        onChange={handleInputChange}
                        placeholder="Enter meta description (120-160 characters)"
                        rows="3"
                        maxLength={160}
                      />
                      <small>Recommended: 120-160 characters</small>
                    </div>

                    <div className="form-group">
                      <label>Canonical URL</label>
                      <input
                        type="url"
                        name="canonical_url"
                        value={formData.canonical_url}
                        onChange={handleInputChange}
                        placeholder="https://example.com/page"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group checkbox">
                        <input
                          type="checkbox"
                          id="index_setting"
                          name="index_setting"
                          checked={formData.index_setting}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="index_setting">Index / No Index</label>
                      </div>

                      <div className="form-group checkbox">
                        <input
                          type="checkbox"
                          id="follow_setting"
                          name="follow_setting"
                          checked={formData.follow_setting}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="follow_setting">Follow / No Follow</label>
                      </div>
                    </div>

                    {/* Search Preview */}
                    <div className="search-preview">
                      <h5>🔎 Google Search Preview</h5>
                      <div className="preview-box">
                        <div className="preview-title">{formData.meta_title || 'Your Page Title'}</div>
                        <div className="preview-url">example.com › {formData.slug}</div>
                        <div className="preview-description">
                          {formData.meta_description || 'Your meta description will appear here...'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SEO Settings - Social */}
              <div className="form-section">
                <div className="section-header" onClick={() => toggleSection('seoSocial')}>
                  <h4>📱 SEO Settings - Social Media</h4>
                  {expandedSections.seoSocial ? <FaChevronUp /> : <FaChevronDown />}
                </div>

                {expandedSections.seoSocial && (
                  <div className="section-content">
                    <div className="form-group">
                      <label>OG Title (Open Graph)</label>
                      <input
                        type="text"
                        name="og_title"
                        value={formData.og_title}
                        onChange={handleInputChange}
                        placeholder="Title for social media sharing"
                      />
                    </div>

                    <div className="form-group">
                      <label>OG Description</label>
                      <textarea
                        name="og_description"
                        value={formData.og_description}
                        onChange={handleInputChange}
                        placeholder="Description for social media sharing"
                        rows="3"
                      />
                    </div>

                    <div className="form-group">
                      <label>OG Image URL</label>
                      <input
                        type="url"
                        name="og_image_url"
                        value={formData.og_image_url}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                      />
                      {formData.og_image_url && (
                        <img src={formData.og_image_url} alt="OG Preview" className="image-preview" />
                      )}
                    </div>

                    <div className="form-group">
                      <label>OG Type</label>
                      <select name="og_type" value={formData.og_type || 'website'} onChange={handleInputChange}>
                        <option value="website">Website</option>
                        <option value="article">Article</option>
                        <option value="business.business">Business</option>
                        <option value="product">Product</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Twitter Card Type</label>
                      <select name="twitter_card" value={formData.twitter_card || 'summary_large_image'} onChange={handleInputChange}>
                        <option value="summary">Summary</option>
                        <option value="summary_large_image">Summary with Large Image</option>
                        <option value="app">App</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Twitter Creator</label>
                      <input
                        type="text"
                        name="twitter_creator"
                        value={formData.twitter_creator || ''}
                        onChange={handleInputChange}
                        placeholder="@username (without @)"
                      />
                      <small>Twitter handle for creator attribution</small>
                    </div>
                  </div>
                )}
              </div>

              {/* SEO Keywords Section */}
              <div className="form-section">
                <div className="section-header" onClick={() => toggleSection('seoKeywords')}>
                  <h4>🎯 Keywords</h4>
                  {expandedSections.seoKeywords ? <FaChevronUp /> : <FaChevronDown />}
                </div>

                {expandedSections.seoKeywords !== false && (
                  <div className="section-content">
                    <div className="form-group">
                      <label>Primary Keyword</label>
                      <input
                        type="text"
                        name="primary_keyword"
                        value={formData.primary_keyword}
                        onChange={handleInputChange}
                        placeholder="Main target keyword"
                      />
                    </div>

                    <div className="form-group">
                      <label>Secondary Keywords</label>
                      <textarea
                        name="secondary_keywords"
                        value={formData.secondary_keywords}
                        onChange={handleInputChange}
                        placeholder="Comma-separated secondary keywords"
                        rows="2"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SEO Advanced Settings */}
              <div className="form-section">
                <div className="section-header" onClick={() => toggleSection('seoAdvanced')}>
                  <h4>⚙️ Advanced SEO</h4>
                  {expandedSections.seoAdvanced ? <FaChevronUp /> : <FaChevronDown />}
                </div>

                {expandedSections.seoAdvanced && (
                  <div className="section-content">
                    <div className="form-group">
                      <label>Robots Directive</label>
                      <select name="robots_directive" value={formData.robots_directive} onChange={handleInputChange}>
                        <option value="index,follow">Index, Follow</option>
                        <option value="noindex,follow">No Index, Follow</option>
                        <option value="index,nofollow">Index, No Follow</option>
                        <option value="noindex,nofollow">No Index, No Follow</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Schema Type</label>
                      <select name="schema_type" value={formData.schema_type} onChange={handleInputChange}>
                        <option value="">None</option>
                        <option value="Article">Article</option>
                        <option value="Product">Product</option>
                        <option value="Service">Service</option>
                        <option value="LocalBusiness">Local Business</option>
                        <option value="FAQPage">FAQ Page</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Custom Head Tags</label>
                      <textarea
                        name="custom_head_tags"
                        value={formData.custom_head_tags}
                        onChange={handleInputChange}
                        placeholder="Custom HTML tags for head (e.g., meta tags)"
                        rows="3"
                      />
                    </div>

                    <div className="form-group">
                      <label>Custom JSON-LD</label>
                      <textarea
                        name="custom_json_ld"
                        value={formData.custom_json_ld}
                        onChange={handleInputChange}
                        placeholder='Custom structured data (JSON-LD format)'
                        rows="4"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Page Visibility & Navigation */}
              <div className="form-section">
                <div className="section-header" onClick={() => toggleSection('visibility')}>
                  <h4>👁️ Visibility & Navigation</h4>
                  {expandedSections.visibility ? <FaChevronUp /> : <FaChevronDown />}
                </div>

                {expandedSections.visibility && (
                  <div className="section-content">
                    <div className="form-group">
                      <label>Visibility</label>
                      <select name="visibility" value={formData.visibility || 'public'} onChange={handleInputChange}>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                      </select>
                      <small>Control who can see this page</small>
                    </div>

                    <div className="form-row">
                      <div className="form-group checkbox">
                        <input
                          type="checkbox"
                          id="show_in_navbar"
                          name="show_in_navbar"
                          checked={formData.show_in_navbar || false}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="show_in_navbar">Show in Navigation Menu</label>
                      </div>

                      <div className="form-group checkbox">
                        <input
                          type="checkbox"
                          id="show_in_footer"
                          name="show_in_footer"
                          checked={formData.show_in_footer || false}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="show_in_footer">Show in Footer</label>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Parent Page (For Sub-Pages)</label>
                      <select name="parent_page_id" value={formData.parent_page_id || ''} onChange={handleInputChange}>
                        <option value="">No Parent (Top Level)</option>
                        {(allPages || []).filter(p => p.id !== formData.id).map((p) => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                      <small>Create a page hierarchy for sub-pages</small>
                    </div>
                  </div>
                )}
              </div>

              {/* SEO Analysis */}
              <div className="seo-analysis">
                <h4>📊 SEO Analysis</h4>
                <div className="analysis-checklist">
                  <div className={`check-item ${seoChecks.seoTitle ? 'passed' : ''}`}>
                    {seoChecks.seoTitle ? <FaCheck /> : <FaExclamationTriangle />}
                    <span>SEO Title configured</span>
                  </div>
                  <div className={`check-item ${seoChecks.metaDescription ? 'passed' : ''}`}>
                    {seoChecks.metaDescription ? <FaCheck /> : <FaExclamationTriangle />}
                    <span>Meta Description configured</span>
                  </div>
                  <div className={`check-item ${seoChecks.seoFriendlySlug ? 'passed' : ''}`}>
                    {seoChecks.seoFriendlySlug ? <FaCheck /> : <FaExclamationTriangle />}
                    <span>SEO-friendly URL slug</span>
                  </div>
                  <div className={`check-item ${seoChecks.canonicalUrl ? 'passed' : ''}`}>
                    {seoChecks.canonicalUrl ? <FaCheck /> : <FaExclamationTriangle />}
                    <span>Canonical URL set</span>
                  </div>
                  <div className={`check-item ${seoChecks.ogTitle ? 'passed' : ''}`}>
                    {seoChecks.ogTitle ? <FaCheck /> : <FaExclamationTriangle />}
                    <span>Open Graph title configured</span>
                  </div>
                  <div className={`check-item ${seoChecks.ogDescription ? 'passed' : ''}`}>
                    {seoChecks.ogDescription ? <FaCheck /> : <FaExclamationTriangle />}
                    <span>Open Graph description configured</span>
                  </div>
                </div>

                {seoScore < 70 && (
                  <div className="analysis-warning">
                    <strong>⚠️ Optimization Tips:</strong>
                    <ul>
                      {!seoChecks.seoTitle && <li>Add a compelling SEO title (30-60 characters)</li>}
                      {!seoChecks.metaDescription && <li>Write a descriptive meta description (120-160 characters)</li>}
                      {!seoChecks.seoFriendlySlug && <li>Use a clean, URL-friendly slug with hyphens</li>}
                      {!seoChecks.canonicalUrl && <li>Set a canonical URL to prevent duplicate content</li>}
                      {!seoChecks.ogTitle && <li>Add an Open Graph title for social sharing</li>}
                      {!seoChecks.ogDescription && <li>Add an Open Graph description for social sharing</li>}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
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
