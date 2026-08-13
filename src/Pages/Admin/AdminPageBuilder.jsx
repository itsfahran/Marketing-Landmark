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

      setPageName(data.name);
      setPageSlug(data.slug);
      setPageStatus(data.status);

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
      if (pageId) {
        await supabase
          .from('pages')
          .update({
            name: pageName,
            slug: pageSlug,
            status: pageStatus,
            components_config: selectedComponents,
            updated_at: new Date().toISOString(),
          })
          .eq('id', pageId);
      } else {
        await supabase.from('pages').insert({
          name: pageName,
          slug: pageSlug,
          status: pageStatus,
          components_config: selectedComponents,
        });
      }

      alert('Page saved!');
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
