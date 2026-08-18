import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '../../lib/supabase';
import { uploadImage } from '../../lib/imageUpload';
import './ItemManager.css';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaGripVertical, FaEye, FaEyeSlash } from 'react-icons/fa';

const ServicesManager = ({ onClose }) => {
  const supabase = getSupabaseClient();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editItem, setEditItem] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [allPages, setAllPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [loadingPages, setLoadingPages] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (err) {
      console.error('Error loading services:', err);
      alert('Error loading services');
    } finally {
      setLoading(false);
    }
  };

  const loadPages = async () => {
    try {
      setLoadingPages(true);
      const { data, error } = await supabase
        .from('pages')
        .select('id, name, slug, parent_page_id')
        .order('name', { ascending: true });

      if (error) throw error;
      setAllPages(data || []);
      setSelectedPages([]);
    } catch (err) {
      console.error('Error loading pages:', err);
      alert('Error loading pages');
    } finally {
      setLoadingPages(false);
    }
  };

  const handleSelectService = async (service) => {
    setSelectedService(service);
    await loadPages();
  };

  const togglePageSelection = (pageId) => {
    setSelectedPages(prev =>
      prev.includes(pageId)
        ? prev.filter(id => id !== pageId)
        : [...prev, pageId]
    );
  };

  const handleAssignPages = async () => {
    if (!selectedService || selectedPages.length === 0) {
      alert('Select at least one page');
      return;
    }

    try {
      console.log('Assigning pages to service:', selectedService.id);

      // Update all selected pages to have this service as parent
      const results = await Promise.all(
        selectedPages.map(pageId => {
          console.log('Updating page:', pageId);
          return supabase
            .from('pages')
            .update({ parent_page_id: selectedService.id })
            .eq('id', pageId);
        })
      );

      // Check for errors
      const hasError = results.some(result => result.error);
      if (hasError) {
        const error = results.find(r => r.error)?.error;
        throw error || new Error('Update failed');
      }

      console.log('Pages assigned successfully!');
      alert('Pages assigned successfully!');
      setSelectedPages([]);
      await loadPages();
    } catch (err) {
      console.error('Error assigning pages:', err);
      alert('Error: ' + (err.message || 'Failed to assign pages'));
    }
  };

  const handleAddService = async () => {
    try {
      const newService = {
        title: 'New Service',
        description: 'Service description',
        icon: '⭐',
        page_url: '/services/new',
        show_on_homepage: true,
        show_in_navbar: true,
        is_active: true,
        sort_order: services.length,
      };

      const { error } = await supabase
        .from('services')
        .insert([newService]);

      if (error) throw error;
      loadServices();
    } catch (err) {
      console.error('Error adding service:', err);
      alert('Error adding service');
    }
  };

  const handleSaveService = async (item) => {
    if (!item.title) {
      alert('Please fill in service title');
      return;
    }

    try {
      if (item.id) {
        const { error } = await supabase
          .from('services')
          .update({
            title: item.title,
            description: item.description,
            icon: item.icon,
            icon_url: item.icon_url,
            page_url: item.page_url,
            show_on_homepage: item.show_on_homepage,
            show_in_navbar: item.show_in_navbar,
            is_active: item.is_active,
            sort_order: item.sort_order,
          })
          .eq('id', item.id);

        if (error) throw error;
      }

      setEditingId(null);
      loadServices();
    } catch (err) {
      console.error('Error saving service:', err);
      alert('Error saving service');
    }
  };

  const handleIconUpload = async (file) => {
    try {
      const url = await uploadImage(file);
      setEditItem({ ...editItem, icon_url: url });
    } catch (error) {
      alert('Icon upload failed: ' + error.message);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this service?')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadServices();
    } catch (err) {
      console.error('Error deleting service:', err);
      alert('Error deleting service');
    }
  };

  const handleDragStart = (item) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (targetItem) => {
    if (!draggedItem || draggedItem.id === targetItem.id) return;

    try {
      await Promise.all([
        supabase
          .from('services')
          .update({ sort_order: targetItem.sort_order })
          .eq('id', draggedItem.id),
        supabase
          .from('services')
          .update({ sort_order: draggedItem.sort_order })
          .eq('id', targetItem.id),
      ]);

      setDraggedItem(null);
      loadServices();
    } catch (err) {
      console.error('Error reordering:', err);
    }
  };

  const toggleFlag = async (service, field) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ [field]: !service[field] })
        .eq('id', service.id);

      if (error) throw error;
      loadServices();
    } catch (err) {
      console.error('Error toggling flag:', err);
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="manager-modal">
          <h3>Loading...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="manager-modal" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="manager-header">
          <h3>💼 Manage Services</h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <button
          className="add-btn"
          onClick={handleAddService}
          style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FaPlus /> Add Service
        </button>

        <div style={{ display: 'grid', gap: '15px' }}>
          {services.map((service) => (
            <div
              key={service.id}
              draggable
              onDragStart={() => handleDragStart(service)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(service)}
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                padding: 'var(--spacing-lg)',
                cursor: draggedItem?.id === service.id ? 'grabbing' : 'grab',
                opacity: draggedItem?.id === service.id ? 0.6 : service.is_active ? 1 : 0.5,
              }}
            >
              {editingId === service.id ? (
                <div>
                  <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      placeholder="Service Title"
                      value={editItem.title || ''}
                      onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                      style={{
                        flex: 1,
                        padding: 'var(--spacing-md)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Icon (emoji)"
                      value={editItem.icon || ''}
                      onChange={(e) => setEditItem({ ...editItem, icon: e.target.value })}
                      style={{
                        width: '60px',
                        padding: 'var(--spacing-md)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <textarea
                      placeholder="Description"
                      value={editItem.description || ''}
                      onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                      style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        minHeight: '80px',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <input
                      type="text"
                      placeholder="Page URL (e.g., /seo, /services/web-dev)"
                      value={editItem.page_url || ''}
                      onChange={(e) => setEditItem({ ...editItem, page_url: e.target.value })}
                      style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Service Icon (Custom Image - Optional)
                    </label>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <input
                        type="text"
                        placeholder="Icon URL (e.g., https://...)"
                        value={editItem.icon_url || ''}
                        onChange={(e) => setEditItem({ ...editItem, icon_url: e.target.value })}
                        style={{
                          flex: 1,
                          padding: 'var(--spacing-md)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-md)',
                        }}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleIconUpload(e.target.files[0]);
                          }
                        }}
                        style={{ flex: 0.5 }}
                      />
                    </div>
                    {editItem.icon_url && (
                      <img src={editItem.icon_url} alt="icon preview" style={{ maxWidth: '50px', maxHeight: '50px', borderRadius: '8px' }} />
                    )}
                  </div>

                  <div style={{ marginBottom: '15px', display: 'flex', gap: '15px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={editItem.show_on_homepage || false}
                        onChange={(e) => setEditItem({ ...editItem, show_on_homepage: e.target.checked })}
                      />
                      Show on Homepage
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={editItem.show_in_navbar || false}
                        onChange={(e) => setEditItem({ ...editItem, show_in_navbar: e.target.checked })}
                      />
                      Show in Navbar
                    </label>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleSaveService(editItem)}
                      style={{
                        padding: 'var(--spacing-md) var(--spacing-lg)',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <FaSave /> Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{
                        padding: 'var(--spacing-md) var(--spacing-lg)',
                        backgroundColor: 'var(--border)',
                        color: 'var(--text-primary)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <FaGripVertical style={{ color: 'var(--text-muted)', cursor: 'grab' }} />
                      <strong style={{ fontSize: '16px' }}>{service.title}</strong>
                      <span style={{ fontSize: '16px' }}>{service.icon}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '5px 0' }}>
                      {service.description?.substring(0, 80)}...
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '5px 0' }}>
                      {service.page_url}
                    </p>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '8px', fontSize: '12px' }}>
                      <span style={{ color: service.show_on_homepage ? 'var(--primary)' : 'var(--text-muted)' }}>
                        📱 Homepage: {service.show_on_homepage ? 'Yes' : 'No'}
                      </span>
                      <span style={{ color: service.show_in_navbar ? 'var(--primary)' : 'var(--text-muted)' }}>
                        🔗 Navbar: {service.show_in_navbar ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => toggleFlag(service, 'show_on_homepage')}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: service.show_on_homepage ? 'var(--primary)' : 'var(--border)',
                        color: service.show_on_homepage ? 'white' : 'var(--text-primary)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                      title="Show on homepage"
                    >
                      📱 Homepage
                    </button>
                    <button
                      onClick={() => toggleFlag(service, 'show_in_navbar')}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: service.show_in_navbar ? 'var(--primary)' : 'var(--border)',
                        color: service.show_in_navbar ? 'white' : 'var(--text-primary)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                      title="Show in navbar"
                    >
                      🔗 Navbar
                    </button>
                    <button
                      onClick={() => handleSelectService(service)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                      title="Assign pages as sub-services"
                    >
                      📄 Pages
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(service.id);
                        setEditItem(service);
                      }}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: 'var(--danger)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pages Assignment Section */}
        {selectedService && (
          <div style={{
            marginTop: '40px',
            padding: '20px',
            backgroundColor: 'var(--surface-alt)',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--primary)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>📄 Assign Pages to: <strong>{selectedService.title}</strong></h3>
              <button
                onClick={() => setSelectedService(null)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: 'var(--border)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                }}
              >
                <FaTimes /> Close
              </button>
            </div>

            {loadingPages ? (
              <p>Loading pages...</p>
            ) : allPages.length === 0 ? (
              <p>No pages available</p>
            ) : (
              <>
                <div style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  marginBottom: '20px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '15px',
                }}>
                  {allPages.map((page) => (
                    <label
                      key={page.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: selectedPages.includes(page.id) ? 'var(--primary)' : 'transparent',
                        color: selectedPages.includes(page.id) ? 'white' : 'inherit',
                        cursor: 'pointer',
                        marginBottom: '8px',
                        transition: 'all 0.2s',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPages.includes(page.id)}
                        onChange={() => togglePageSelection(page.id)}
                        style={{ marginRight: '10px', cursor: 'pointer' }}
                      />
                      <div>
                        <strong>{page.name || page.title}</strong>
                        <p style={{ fontSize: '12px', opacity: 0.7, margin: '3px 0' }}>
                          {page.slug}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleAssignPages}
                    disabled={selectedPages.length === 0}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: selectedPages.length === 0 ? 'var(--border)' : 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      cursor: selectedPages.length === 0 ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                    }}
                  >
                    ✓ Assign {selectedPages.length} Page{selectedPages.length !== 1 ? 's' : ''} as Sub-Services
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button
            onClick={onClose}
            style={{
              padding: 'var(--spacing-md) var(--spacing-lg)',
              backgroundColor: 'var(--border)',
              color: 'var(--text-primary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesManager;
