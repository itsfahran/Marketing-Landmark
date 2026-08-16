import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '../../lib/supabase';
import './ItemManager.css';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaGripVertical } from 'react-icons/fa';

const PLATFORM_ICONS = {
  upwork: '💼 Upwork',
  fiverr: '⭐ Fiverr',
  linkedin: '💼 LinkedIn',
  google: '🔍 Google',
  freelancer: '👨‍💼 Freelancer',
  other: '⭐ Other',
};

const TestimonialsManager = ({ onClose }) => {
  const supabase = getSupabaseClient();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editItem, setEditItem] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (err) {
      console.error('Error loading testimonials:', err);
      alert('Error loading testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTestimonial = async () => {
    try {
      const newTestimonial = {
        client_name: 'New Client',
        client_role: 'Role',
        testimonial_text: 'Testimonial text here...',
        rating: 5,
        client_image: '',
        source_platform: 'other',
        sort_order: testimonials.length,
      };

      const { error } = await supabase
        .from('testimonials')
        .insert([newTestimonial]);

      if (error) throw error;
      loadTestimonials();
    } catch (err) {
      console.error('Error adding testimonial:', err);
      alert('Error adding testimonial');
    }
  };

  const handleSaveTestimonial = async (item) => {
    if (!item.client_name || !item.testimonial_text) {
      alert('Please fill in name and testimonial');
      return;
    }

    try {
      if (item.id) {
        const { error } = await supabase
          .from('testimonials')
          .update({
            client_name: item.client_name,
            client_role: item.client_role,
            testimonial_text: item.testimonial_text,
            rating: item.rating,
            client_image: item.client_image,
            source_platform: item.source_platform,
            sort_order: item.sort_order,
          })
          .eq('id', item.id);

        if (error) throw error;
      }

      setEditingId(null);
      loadTestimonials();
    } catch (err) {
      console.error('Error saving testimonial:', err);
      alert('Error saving testimonial');
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadTestimonials();
    } catch (err) {
      console.error('Error deleting testimonial:', err);
      alert('Error deleting testimonial');
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
      const newOrder = testimonials.map((t) => {
        if (t.id === draggedItem.id) {
          return { ...t, sort_order: targetItem.sort_order };
        }
        if (t.id === targetItem.id) {
          return { ...t, sort_order: draggedItem.sort_order };
        }
        return t;
      });

      // Update both items in database
      await Promise.all([
        supabase
          .from('testimonials')
          .update({ sort_order: targetItem.sort_order })
          .eq('id', draggedItem.id),
        supabase
          .from('testimonials')
          .update({ sort_order: draggedItem.sort_order })
          .eq('id', targetItem.id),
      ]);

      setTestimonials(newOrder);
      setDraggedItem(null);
    } catch (err) {
      console.error('Error reordering:', err);
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
          <h3>⭐ Manage Testimonials</h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <button
          className="add-btn"
          onClick={handleAddTestimonial}
          style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FaPlus /> Add Testimonial
        </button>

        <div style={{ display: 'grid', gap: '15px' }}>
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              draggable
              onDragStart={() => handleDragStart(testimonial)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(testimonial)}
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                padding: 'var(--spacing-lg)',
                cursor: draggedItem?.id === testimonial.id ? 'grabbing' : 'grab',
                opacity: draggedItem?.id === testimonial.id ? 0.6 : 1,
              }}
            >
              {editingId === testimonial.id ? (
                <div>
                  <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      placeholder="Client Name"
                      value={editItem.client_name || ''}
                      onChange={(e) => setEditItem({ ...editItem, client_name: e.target.value })}
                      style={{
                        flex: 1,
                        padding: 'var(--spacing-md)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Role"
                      value={editItem.client_role || ''}
                      onChange={(e) => setEditItem({ ...editItem, client_role: e.target.value })}
                      style={{
                        flex: 1,
                        padding: 'var(--spacing-md)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <textarea
                      placeholder="Testimonial text"
                      value={editItem.testimonial_text || ''}
                      onChange={(e) => setEditItem({ ...editItem, testimonial_text: e.target.value })}
                      style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        minHeight: '100px',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
                    <select
                      value={editItem.source_platform || 'other'}
                      onChange={(e) => setEditItem({ ...editItem, source_platform: e.target.value })}
                      style={{
                        flex: 1,
                        padding: 'var(--spacing-md)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      {Object.entries(PLATFORM_ICONS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min="1"
                      max="5"
                      placeholder="Rating"
                      value={editItem.rating || 5}
                      onChange={(e) => setEditItem({ ...editItem, rating: parseInt(e.target.value) })}
                      style={{
                        width: '80px',
                        padding: 'var(--spacing-md)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={editItem.client_image || ''}
                      onChange={(e) => setEditItem({ ...editItem, client_image: e.target.value })}
                      style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleSaveTestimonial(editItem)}
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
                      <strong style={{ fontSize: '16px' }}>{testimonial.client_name}</strong>
                      <span style={{ color: 'var(--primary)', fontSize: '12px' }}>
                        {PLATFORM_ICONS[testimonial.source_platform] || PLATFORM_ICONS.other}
                      </span>
                      <span style={{ color: 'var(--text-muted)', marginLeft: 'auto' }}>
                        {'⭐'.repeat(testimonial.rating || 5)}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 8px' }}>
                      {testimonial.client_role}
                    </p>
                    <p style={{ color: 'var(--text-primary)', fontSize: '14px', margin: '0' }}>
                      {testimonial.testimonial_text?.substring(0, 100)}...
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        setEditingId(testimonial.id);
                        setEditItem(testimonial);
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
                      onClick={() => handleDeleteTestimonial(testimonial.id)}
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

export default TestimonialsManager;
