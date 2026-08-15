import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '../../lib/supabase';
import './ItemManager.css';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';

const VideoTestimonialsManager = ({ videoData, pageId, template, onClose }) => {
  const supabase = getSupabaseClient();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const videoId = videoData?.id;

  useEffect(() => {
    if (videoId) {
      loadItems();
    }
  }, [videoId]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('component_videotestimonials_items')
        .select('*')
        .eq('videotestimonials_id', videoId)
        .order('sort_order');

      setItems(data || []);
    } catch (err) {
      console.error('Error loading videos:', err);
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
    if (!videoId) {
      alert('Please save the Video Testimonials component first');
      return;
    }

    if (!item.title || !item.video_url) {
      alert('Please fill title and video URL');
      return;
    }

    try {
      if (item.isNew) {
        await supabase.from('component_videotestimonials_items').insert({
          videotestimonials_id: videoId,
          title: item.title,
          subtitle: item.subtitle || '',
          video_url: item.video_url,
          profile_image_url: item.profile_image_url || '',
          sort_order: item.sort_order,
        });
      } else {
        await supabase
          .from('component_videotestimonials_items')
          .update({
            title: item.title,
            subtitle: item.subtitle,
            video_url: item.video_url,
            profile_image_url: item.profile_image_url,
            sort_order: item.sort_order,
          })
          .eq('id', item.id);
      }

      setEditingItem(null);
      loadItems();
      alert('Video saved!');
    } catch (err) {
      console.error('Error saving:', err);
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Delete this video?')) return;

    try {
      await supabase.from('component_videotestimonials_items').delete().eq('id', itemId);
      loadItems();
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  if (!videoId) {
    return (
      <div className="edit-modal-overlay">
        <div className="edit-modal">
          <h4>Error</h4>
          <p>Please save the Video Testimonials component first</p>
          <button className="cancel-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h4>Manage Video Testimonials ({template})</h4>
          <button className="cancel-btn" onClick={onClose} style={{ width: 'auto' }}>
            <FaTimes />
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <div className="cards-list">
              {items.length === 0 ? (
                <p className="no-items">No videos yet. Add your first!</p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="item-card">
                    <div className="item-info">
                      {item.profile_image_url && (
                        <img src={item.profile_image_url} alt={item.title} style={{ width: '50px', height: '50px', marginRight: '10px', borderRadius: '50%', objectFit: 'cover' }} />
                      )}
                      <div>
                        <strong>{item.title}</strong>
                        <p style={{ fontSize: '12px', color: '#666' }}>{item.subtitle}</p>
                      </div>
                    </div>

                    <div className="item-actions">
                      <button className="edit-btn" onClick={() => setEditingItem(item)}>
                        <FaEdit /> Edit
                      </button>
                      <button className="delete-btn" onClick={() => handleDeleteItem(item.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button className="add-btn" onClick={handleAddItem} style={{ width: '100%', marginTop: '15px' }}>
              <FaPlus /> Add Video
            </button>
          </>
        )}

        {editingItem && (
          <div className="edit-modal-overlay">
            <div className="edit-modal">
              <h4>Edit Video</h4>

              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g., John Doe"
                />
              </div>

              <div className="form-group">
                <label>Subtitle</label>
                <input
                  type="text"
                  value={editingItem.subtitle}
                  onChange={(e) => setEditingItem({ ...editingItem, subtitle: e.target.value })}
                  placeholder="e.g., CEO, Company Name"
                />
              </div>

              <div className="form-group">
                <label>Video URL * (YouTube embed URL)</label>
                <input
                  type="text"
                  value={editingItem.video_url}
                  onChange={(e) => setEditingItem({ ...editingItem, video_url: e.target.value })}
                  placeholder="https://www.youtube.com/embed/VIDEO_ID"
                />
                <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                  Get embed URL from YouTube: Share → Embed, then copy src URL
                </small>
              </div>

              <div className="form-group">
                <label>Profile Image URL</label>
                <input
                  type="text"
                  value={editingItem.profile_image_url}
                  onChange={(e) => setEditingItem({ ...editingItem, profile_image_url: e.target.value })}
                  placeholder="https://example.com/profile.jpg"
                />
                {editingItem.profile_image_url && (
                  <img src={editingItem.profile_image_url} alt="Preview" style={{ width: '80px', height: '80px', marginTop: '10px', borderRadius: '50%', objectFit: 'cover' }} />
                )}
              </div>

              <div className="modal-actions">
                <button className="save-btn" onClick={() => handleSaveItem(editingItem)}>
                  <FaSave /> Save
                </button>
                <button className="cancel-btn" onClick={() => setEditingItem(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoTestimonialsManager;
