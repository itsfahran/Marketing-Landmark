import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '../../lib/supabase';
import './ItemManager.css';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';

const HireManager = ({ hireData, pageId, template, onClose }) => {
  const supabase = getSupabaseClient();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const hireId = hireData?.id;

  useEffect(() => {
    if (hireId) {
      loadItems();
    }
  }, [hireId]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('component_hire_items')
        .select('*')
        .eq('hire_id', hireId)
        .order('sort_order');

      setItems(data || []);
    } catch (err) {
      console.error('Error loading hire items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    const newItem = {
      id: `temp_${Date.now()}`,
      title: '',
      image_url: '',
      rating: 4.5,
      review_count: 0,
      price_label: '',
      sort_order: items.length,
      isNew: true,
    };
    setItems([...items, newItem]);
    setEditingItem(newItem);
  };

  const handleSaveItem = async (item) => {
    if (!hireId) {
      alert('Please save the Hire component first');
      return;
    }

    if (!item.title || !item.image_url) {
      alert('Please fill title and image');
      return;
    }

    try {
      if (item.isNew) {
        await supabase.from('component_hire_items').insert({
          hire_id: hireId,
          title: item.title,
          image_url: item.image_url,
          rating: item.rating || 4.5,
          review_count: item.review_count || 0,
          price_label: item.price_label || '',
          sort_order: item.sort_order,
        });
      } else {
        await supabase
          .from('component_hire_items')
          .update({
            title: item.title,
            image_url: item.image_url,
            rating: item.rating,
            review_count: item.review_count,
            price_label: item.price_label,
            sort_order: item.sort_order,
          })
          .eq('id', item.id);
      }

      setEditingItem(null);
      loadItems();
      alert('Item saved!');
    } catch (err) {
      console.error('Error saving:', err);
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Delete this gig?')) return;

    try {
      await supabase.from('component_hire_items').delete().eq('id', itemId);
      loadItems();
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const handleImageUpload = async (file, item) => {
    if (!file) return;

    try {
      const fileName = `hire-${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('portfolio-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicUrl } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(fileName);

      setEditingItem({
        ...editingItem,
        image_url: publicUrl.publicUrl,
      });
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading image');
    }
  };

  if (!hireId) {
    return (
      <div className="edit-modal-overlay">
        <div className="edit-modal">
          <h4>Error</h4>
          <p>Please save the Hire component first</p>
          <button className="cancel-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h4>Manage Hire/Gigs ({template})</h4>
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
                <p className="no-items">No gigs yet. Add your first!</p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="item-card">
                    <div className="item-info">
                      {item.image_url && <img src={item.image_url} alt={item.title} style={{ width: '50px', height: '50px', marginRight: '10px', borderRadius: '8px' }} />}
                      <div>
                        <strong>{item.title}</strong>
                        <p style={{ fontSize: '12px', color: '#666' }}>⭐ {item.rating} ({item.review_count} reviews)</p>
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
              <FaPlus /> Add New Gig
            </button>
          </>
        )}

        {editingItem && (
          <div className="edit-modal-overlay">
            <div className="edit-modal">
              <h4>Edit Gig</h4>

              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g., Website Design"
                />
              </div>

              <div className="form-group">
                <label>Image URL or Upload *</label>
                {editingItem.image_url && <img src={editingItem.image_url} alt="Preview" style={{ width: '100px', height: '100px', marginBottom: '10px', borderRadius: '8px' }} />}
                <input
                  type="text"
                  value={editingItem.image_url}
                  onChange={(e) => setEditingItem({ ...editingItem, image_url: e.target.value })}
                  placeholder="Image URL"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], editingItem)}
                  style={{ marginTop: '10px' }}
                />
              </div>

              <div className="form-group">
                <label>Rating</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={editingItem.rating}
                  onChange={(e) => setEditingItem({ ...editingItem, rating: parseFloat(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Review Count</label>
                <input
                  type="number"
                  min="0"
                  value={editingItem.review_count}
                  onChange={(e) => setEditingItem({ ...editingItem, review_count: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Price Label (e.g., "$50")</label>
                <input
                  type="text"
                  value={editingItem.price_label}
                  onChange={(e) => setEditingItem({ ...editingItem, price_label: e.target.value })}
                  placeholder="$50"
                />
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

export default HireManager;
