import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSupabaseClient } from '../../lib/supabase';
import { COMPONENTS, getAvailableComponents } from '../../lib/pageBuilderConfig';
import { FaArrowLeft, FaCheck, FaGripVertical, FaEyeSlash, FaSave } from 'react-icons/fa';
import './AdminPageBuilder.css';
import ComponentDataForms from './ComponentDataForms';

const AdminPageBuilder = () => {
  const navigate = useNavigate();
  const { pageId } = useParams();
  const supabase = getSupabaseClient();

  // Page settings
  const [pageName, setPageName] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [pageStatus, setPageStatus] = useState('draft');
  const [pageTitle, setPageTitle] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImageUrl, setOgImageUrl] = useState('');
  const [ogType, setOgType] = useState('website');
  const [twitterCard, setTwitterCard] = useState('summary');
  const [twitterCreator, setTwitterCreator] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [robotsDirective, setRobotsDirective] = useState('index,follow');
  const [primaryKeyword, setPrimaryKeyword] = useState('');
  const [secondaryKeywords, setSecondaryKeywords] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [showInNavbar, setShowInNavbar] = useState(false);
  const [showInFooter, setShowInFooter] = useState(false);

  // Components configuration
  const [selectedComponents, setSelectedComponents] = useState(
    getAvailableComponents().map((comp, idx) => ({
      id: comp.id,
      enabled: true,
      order: idx,
      template: 'SEO',
    }))
  );

  const [draggedItem, setDraggedItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pageId) {
      loadPage();
    }
  }, [pageId]);

  const loadPage = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', pageId)
        .single();

      if (error) throw error;

      setPageName(data.name || '');
      setPageSlug(data.slug || '');
      setPageStatus(data.status || 'draft');
      setPageTitle(data.title || '');
      setMetaTitle(data.meta_title || '');
      setMetaDescription(data.meta_description || '');
      setFocusKeyword(data.focus_keyword || '');
      setOgTitle(data.og_title || '');
      setOgDescription(data.og_description || '');
      setOgImageUrl(data.og_image_url || '');
      setOgType(data.og_type || 'website');
      setTwitterCard(data.twitter_card || 'summary');
      setTwitterCreator(data.twitter_creator || '');
      setCanonicalUrl(data.canonical_url || '');
      setRobotsDirective(data.robots_directive || 'index,follow');
      setPrimaryKeyword(data.primary_keyword || '');
      setSecondaryKeywords(data.secondary_keywords || '');
      setVisibility(data.visibility || 'public');
      setShowInNavbar(data.show_in_navbar || false);
      setShowInFooter(data.show_in_footer || false);

      if (data.components_config) {
        setSelectedComponents(data.components_config);
      }
    } catch (err) {
      console.error('Error loading page:', err);
      alert('Error loading page');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setPageName(name);
    setPageSlug(generateSlug(name));
  };

  const toggleComponent = (componentId) => {
    setSelectedComponents(
      selectedComponents.map(comp =>
        comp.id === componentId ? { ...comp, enabled: !comp.enabled } : comp
      )
    );
  };

  const changeTemplate = (componentId, template) => {
    setSelectedComponents(
      selectedComponents.map(comp =>
        comp.id === componentId ? { ...comp, template } : comp
      )
    );
  };

  const handleDragStart = (index) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex) => {
    if (draggedItem === null || draggedItem === dropIndex) return;

    const newComponents = [...selectedComponents];
    const [draggedComponent] = newComponents.splice(draggedItem, 1);
    newComponents.splice(dropIndex, 0, draggedComponent);

    setSelectedComponents(
      newComponents.map((comp, idx) => ({ ...comp, order: idx }))
    );
    setDraggedItem(null);
  };

  const handleSave = async () => {
    if (!pageName.trim()) {
      alert('Page name required');
      return;
    }

    setSaving(true);
    try {
      // Save page
      if (pageId) {
        await supabase
          .from('pages')
          .update({
            name: pageName,
            title: pageTitle,
            slug: pageSlug,
            status: pageStatus,
            meta_title: metaTitle,
            meta_description: metaDescription,
            focus_keyword: focusKeyword,
            og_title: ogTitle,
            og_description: ogDescription,
            og_image_url: ogImageUrl,
            og_type: ogType,
            twitter_card: twitterCard,
            twitter_creator: twitterCreator,
            canonical_url: canonicalUrl,
            robots_directive: robotsDirective,
            primary_keyword: primaryKeyword,
            secondary_keywords: secondaryKeywords,
            visibility: visibility,
            show_in_navbar: showInNavbar,
            show_in_footer: showInFooter,
            components_config: selectedComponents,
            updated_at: new Date().toISOString(),
          })
          .eq('id', pageId);
      } else {
        await supabase.from('pages').insert({
          name: pageName,
          title: pageTitle,
          slug: pageSlug,
          status: pageStatus,
          meta_title: metaTitle,
          meta_description: metaDescription,
          focus_keyword: focusKeyword,
          og_title: ogTitle,
          og_description: ogDescription,
          og_image_url: ogImageUrl,
          og_type: ogType,
          twitter_card: twitterCard,
          twitter_creator: twitterCreator,
          canonical_url: canonicalUrl,
          robots_directive: robotsDirective,
          primary_keyword: primaryKeyword,
          secondary_keywords: secondaryKeywords,
          visibility: visibility,
          show_in_navbar: showInNavbar,
          show_in_footer: showInFooter,
          components_config: selectedComponents,
        });
      }

      // Also save as service
      const serviceUrl = `/services/${pageSlug}`;

      // Check if service already exists
      const { data: existingService } = await supabase
        .from('services')
        .select('id')
        .eq('page_url', serviceUrl)
        .single();

      if (existingService) {
        // Update existing service
        await supabase
          .from('services')
          .update({
            title: pageName,
            description: pageName,
            is_active: pageStatus === 'published',
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingService.id);
      } else {
        // Create new service
        await supabase
          .from('services')
          .insert({
            title: pageName,
            description: pageName,
            icon: '📄',
            page_url: serviceUrl,
            show_on_homepage: false,
            show_in_navbar: false,
            is_active: pageStatus === 'published',
            sort_order: 0,
          });
      }

      alert('Page aur Service dono saved! 🎉');
      navigate('/admin/pages');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  const enabledComponents = selectedComponents.filter(c => c.enabled);
  const availableComponents = getAvailableComponents();

  return (
    <div className="page-builder-container">
      {/* Header */}
      <div className="pb-header">
        <div className="pb-header-left">
          <button className="pb-back-btn" onClick={() => navigate('/admin/pages')}>
            <FaArrowLeft /> Back
          </button>
          <h1>{pageId ? 'Edit Page' : 'Create New Page'}</h1>
        </div>
        <button
          className="pb-save-btn"
          onClick={handleSave}
          disabled={saving}
        >
          <FaSave /> {saving ? 'Saving...' : 'Save Page'}
        </button>
      </div>

      <div className="pb-content">
        {/* Left Panel - Page Settings */}
        <div className="pb-settings-panel">
          <h2>Page Settings</h2>

          <div className="pb-form-group">
            <label>Page Name *</label>
            <input
              type="text"
              value={pageName}
              onChange={handleNameChange}
              placeholder="Enter page name"
              className="pb-input"
            />
          </div>

          <div className="pb-form-group">
            <label>Page Slug *</label>
            <input
              type="text"
              value={pageSlug}
              onChange={(e) => setPageSlug(e.target.value)}
              className="pb-input"
            />
          </div>

          <div className="pb-form-group">
            <label>Status</label>
            <select
              value={pageStatus}
              onChange={(e) => setPageStatus(e.target.value)}
              className="pb-select"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <hr style={{ margin: '20px 0', opacity: 0.3 }} />
          <h3 style={{ marginBottom: '15px' }}>SEO Settings</h3>

          <div className="pb-form-group">
            <label>Meta Title</label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Page SEO title (60 chars)"
              maxLength="60"
              className="pb-input"
            />
            <small>{metaTitle.length}/60</small>
          </div>

          <div className="pb-form-group">
            <label>Meta Description</label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Meta description (160 chars)"
              maxLength="160"
              rows="3"
              className="pb-input"
            />
            <small>{metaDescription.length}/160</small>
          </div>

          <div className="pb-form-group">
            <label>Focus Keyword</label>
            <input
              type="text"
              value={focusKeyword}
              onChange={(e) => setFocusKeyword(e.target.value)}
              placeholder="Main keyword to rank for"
              className="pb-input"
            />
          </div>

          <div className="pb-form-group">
            <label>Canonical URL</label>
            <input
              type="url"
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              placeholder="https://example.com/page"
              className="pb-input"
            />
          </div>

          <div className="pb-form-group">
            <label>Robots Directive</label>
            <select
              value={robotsDirective}
              onChange={(e) => setRobotsDirective(e.target.value)}
              className="pb-select"
            >
              <option value="index,follow">Index, Follow</option>
              <option value="noindex,follow">No Index, Follow</option>
              <option value="index,nofollow">Index, No Follow</option>
              <option value="noindex,nofollow">No Index, No Follow</option>
            </select>
          </div>

          <hr style={{ margin: '20px 0', opacity: 0.3 }} />
          <h3 style={{ marginBottom: '15px' }}>Social Media</h3>

          <div className="pb-form-group">
            <label>OG Title</label>
            <input
              type="text"
              value={ogTitle}
              onChange={(e) => setOgTitle(e.target.value)}
              placeholder="Open Graph title"
              className="pb-input"
            />
          </div>

          <div className="pb-form-group">
            <label>OG Description</label>
            <textarea
              value={ogDescription}
              onChange={(e) => setOgDescription(e.target.value)}
              placeholder="Open Graph description"
              rows="3"
              className="pb-input"
            />
          </div>

          <div className="pb-form-group">
            <label>OG Image URL</label>
            <input
              type="url"
              value={ogImageUrl}
              onChange={(e) => setOgImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="pb-input"
            />
          </div>

          <div className="pb-form-group">
            <label>Twitter Card</label>
            <select
              value={twitterCard}
              onChange={(e) => setTwitterCard(e.target.value)}
              className="pb-select"
            >
              <option value="summary">Summary</option>
              <option value="summary_large_image">Summary Large Image</option>
            </select>
          </div>

          <div className="pb-form-group">
            <label>Twitter Creator</label>
            <input
              type="text"
              value={twitterCreator}
              onChange={(e) => setTwitterCreator(e.target.value)}
              placeholder="@username"
              className="pb-input"
            />
          </div>

          <hr style={{ margin: '20px 0', opacity: 0.3 }} />
          <h3 style={{ marginBottom: '15px' }}>Visibility</h3>

          <div className="pb-form-group">
            <label>Visibility</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="pb-select"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="internal">Internal Only</option>
            </select>
          </div>

          <div className="pb-form-group">
            <label>
              <input
                type="checkbox"
                checked={showInNavbar}
                onChange={(e) => setShowInNavbar(e.target.checked)}
              />
              {' '}Show in Navbar
            </label>
          </div>

          <div className="pb-form-group">
            <label>
              <input
                type="checkbox"
                checked={showInFooter}
                onChange={(e) => setShowInFooter(e.target.checked)}
              />
              {' '}Show in Footer
            </label>
          </div>
        </div>

        {/* Center Panel - Component Selection */}
        <div className="pb-components-panel">
          <h2>Select Components</h2>
          <p className="pb-hint">Drag to reorder, click to change layout</p>

          <div className="pb-components-list">
            {selectedComponents
              .sort((a, b) => a.order - b.order)
              .map((comp, idx) => {
                const compInfo = COMPONENTS[comp.id];
                return (
                  <div
                    key={comp.id}
                    className={`pb-component-item ${!comp.enabled ? 'disabled' : ''}`}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(idx)}
                  >
                    <div className="pb-comp-left">
                      <FaGripVertical className="pb-drag-icon" />
                      <span className="pb-comp-icon">{compInfo.icon}</span>
                      <div className="pb-comp-info">
                        <h4>{compInfo.name}</h4>
                        <select
                          className="pb-template-select"
                          value={comp.template}
                          onChange={(e) => changeTemplate(comp.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="SEO">SEO</option>
                          <option value="GEO">GEO</option>
                          <option value="LOCAL">LOCAL</option>
                        </select>
                      </div>
                    </div>

                    <button
                      className={`pb-toggle-btn ${comp.enabled ? 'enabled' : 'disabled'}`}
                      onClick={() => toggleComponent(comp.id)}
                    >
                      {comp.enabled ? <FaCheck /> : <FaEyeSlash />}
                    </button>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Right Panel - Component Data Forms */}
        <div className="pb-forms-panel">
          <h2>Fill Component Data</h2>
          <p className="pb-hint">{enabledComponents.length} components enabled</p>

          {enabledComponents.length === 0 ? (
            <div className="pb-empty">
              <p>Enable at least one component</p>
            </div>
          ) : (
            <ComponentDataForms
              pageId={pageId}
              selectedComponents={enabledComponents}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPageBuilder;
