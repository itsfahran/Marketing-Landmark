import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '../../lib/supabase';
import './ItemManager.css';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';

const HomeVideoTestimonialsManager = ({ onClose }) => {
  const supabase = getSupabaseClient();
  const [meta, setMeta] = useState({ heading: '', description: '' });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [editingMeta, setEditingMeta] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [metaRes, itemsRes] = await Promise.all([
        supabase.from('home_video_testimonials').select('*').limit(1),
        supabase
          .from('home_video_testimonials_items')
          .select('*')
          .order('sort_order', { ascending: true }),
      ]);

      if (metaRes.data?.[0]) {
        setMeta(metaRes.data[0]);
      }
      setItems(itemsRes.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    const newItem = {
      id: `temp_${Date.now()}`,
      title: '',
      subtitle: '',
      video_url: '',
      profile_image_url: '',
      sort_order: items.length,
      isNew: true,
    };
    setItems([...items, newItem]);
    setEditingItem(newItem);
  };

  const handleSaveItem = async (item) => {
    if (!item.title || !item.video_url) {
      alert('Please fill title and video URL');
      return;
    }

    try {
      if (item.isNew) {
        await supabase.from('home_video_testimonials_items').insert({
          title: item.title,
          subtitle: item.subtitle || '',
          video_url: item.video_url,
          profile_image_url: item.profile_image_url || '',
          sort_order: item.sort_order,
        });
      } else {
        await supabase.from('home_video_testimonials_items').update({
          title: item.title,
          subtitle: item.subtitle,
          video_url: item.video_url,
          profile_image_url: item.profile_image_url,
          sort_order: item.sort_order,
        }).eq('id', item.id);
      }

      setEditingItem(null);
      loadData();
    } catch (err) {
      console.error('Error saving item:', err);
      alert('Error saving item: ' + err.message);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Delete this testimonial?')) return;

    try {
      await supabase.from('home_video_testimonials_items').delete().eq('id', itemId);
      loadData();
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Error deleting item');
    }
  };

  const handleSaveMeta = async () => {
    try {
      if (meta.id) {
        await supabase
          .from('home_video_testimonials')
          .update({ heading: meta.heading, description: meta.description })
          .eq('id', meta.id);
      } else {
        await supabase.from('home_video_testimonials').insert([meta]);
      }
      setEditingMeta(false);
      loadData();
    } catch (err) {
      console.error('Error saving meta:', err);
      alert('Error saving meta');
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
      <div className="manager-modal">
        <div className="manager-header">
          <h3>🎥 Manage Home Video Testimonials</h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Meta Section */}
        <div className="meta-section" style={{ marginBottom: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
          <h4>Section Settings</h4>
          {editingMeta ? (
            <div>
              <input
                type="text"
                placeholder="Heading"
                value={meta.heading || ''}
                onChange={(e) => setMeta({ ...meta, heading: e.target.value })}
                style={{ marginBottom: '10px', width: '100%' }}
              />
              <textarea
                placeholder="Description"
                value={meta.description || ''}
                onChange={(e) => setMeta({ ...meta, description: e.target.value })}
                rows="3"
                style={{ marginBottom: '10px', width: '100%' }}
              />
              <button onClick={handleSaveMeta} style={{ marginRight: '10px' }}>
                <FaSave /> Save
              </button>
              <button onClick={() => setEditingMeta(false)}>
                <FaTimes /> Cancel
              </button>
            </div>
          ) : (
            <div>
              <p><strong>{meta.heading}</strong></p>
              <p>{meta.description}</p>
              <button onClick={() => setEditingMeta(true)}>
                <FaEdit /> Edit
              </button>
            </div>
          )}
        </div>

        {/* Items Section */}
        <div className="items-section">
          <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>Video Testimonials ({items.length})</h4>
            <button className="add-btn" onClick={handleAddItem}>
              <FaPlus /> Add Video
            </button>
          </div>

          {items.map((item) => (
            <div key={item.id} className="item-card">
              {editingItem?.id === item.id ? (
                <div className="item-edit-form">
                  <input
                    type="text"
                    placeholder="Client Name"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Role/Company"
                    value={editingItem.subtitle}
                    onChange={(e) => setEditingItem({ ...editingItem, subtitle: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="YouTube Embed URL (e.g., https://www.youtube.com/embed/dQw4w9WgXcQ)"
                    value={editingItem.video_url}
                    onChange={(e) => setEditingItem({ ...editingItem, video_url: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Profile Image URL"
                    value={editingItem.profile_image_url}
                    onChange={(e) => setEditingItem({ ...editingItem, profile_image_url: e.target.value })}
                  />
                  <div style={{ marginTop: '10px' }}>
                    <button onClick={() => handleSaveItem(editingItem)}>
                      <FaSave /> Save
                    </button>
                    <button onClick={() => setEditingItem(null)}>
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="item-display">
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.subtitle}</p>
                    <small>{item.video_url}</small>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => setEditingItem(item)}>
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDeleteItem(item.id)}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button onClick={onClose} className="close-btn-bottom">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeVideoTestimonialsManager;
