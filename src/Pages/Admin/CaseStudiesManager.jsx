import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '../../lib/supabase';
import './ItemManager.css';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaStar } from 'react-icons/fa';

const CaseStudiesManager = ({ casestudiesData, pageId, template, onClose }) => {
  const supabase = getSupabaseClient();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const casestudiesId = casestudiesData?.id;

  useEffect(() => {
    if (casestudiesId) {
      loadItems();
    }
  }, [casestudiesId]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('component_casestudies_items')
        .select('*')
        .eq('casestudies_id', casestudiesId)
        .order('sort_order');

      setItems(data || []);
    } catch (err) {
      console.error('Error loading case studies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    const newItem = {
      id: `temp_${Date.now()}`,
      title: '',
      category: '',
      image_url: '',
      description: '',
      project_url: '',
      is_featured: false,
      sort_order: items.length,
      isNew: true,
    };
    setItems([...items, newItem]);
    setEditingItem(newItem);
  };

  const handleSaveItem = async (item) => {
    if (!casestudiesId) {
      alert('Please save the Case Studies component first');
      return;
    }

    if (!item.title || !item.image_url) {
      alert('Please fill title and image');
      return;
    }

    try {
      if (item.isNew) {
        await supabase.from('component_casestudies_items').insert({
          casestudies_id: casestudiesId,
          title: item.title,
          category: item.category || '',
          image_url: item.image_url,
          description: item.description || '',
          project_url: item.project_url || '',
          is_featured: item.is_featured || false,
          sort_order: item.sort_order,
        });
      } else {
        await supabase
          .from('component_casestudies_items')
          .update({
            title: item.title,
            category: item.category,
            image_url: item.image_url,
            description: item.description,
            project_url: item.project_url,
            is_featured: item.is_featured,
            sort_order: item.sort_order,
          })
          .eq('id', item.id);
      }

      setEditingItem(null);
      loadItems();
      alert('Case study saved!');
    } catch (err) {
      console.error('Error saving:', err);
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Delete this case study?')) return;

    try {
      await supabase.from('component_casestudies_items').delete().eq('id', itemId);
      loadItems();
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const handleImageUpload = async (file, item) => {
    if (!file) return;

    try {
      const fileName = `casestudy-${Date.now()}-${file.name}`;
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

  if (!casestudiesId) {
    return (
      <div className="edit-modal-overlay">
        <div className="edit-modal">
          <h4>Error</h4>
          <p>Please save the Case Studies component first</p>
          <button className="cancel-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h4>Manage Case Studies ({template})</h4>
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
                <p className="no-items">No case studies yet. Add your first!</p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="item-card">
                    <div className="item-info">
                      {item.image_url && <img src={item.image_url} alt={item.title} style={{ width: '60px', height: '60px', marginRight: '10px', borderRadius: '8px', objectFit: 'cover' }} />}
                      <div>
                        <strong>{item.title}</strong>
                        <p style={{ fontSize: '12px', color: '#666' }}>{item.category}</p>
                        {item.is_featured && <FaStar style={{ color: '#ffd700', marginTop: '4px' }} />}
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
              <FaPlus /> Add Case Study
            </button>
          </>
        )}

        {editingItem && (
          <div className="edit-modal-overlay">
            <div className="edit-modal">
              <h4>Edit Case Study</h4>

              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Project name"
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  placeholder="e.g., Web Design, Mobile App"
                />
              </div>

              <div className="form-group">
                <label>Image URL or Upload *</label>
                {editingItem.image_url && <img src={editingItem.image_url} alt="Preview" style={{ width: '120px', height: '120px', marginBottom: '10px', borderRadius: '8px', objectFit: 'cover' }} />}
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
                <label>Description</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Project description"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Project URL</label>
                <input
                  type="text"
                  value={editingItem.project_url}
                  onChange={(e) => setEditingItem({ ...editingItem, project_url: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={editingItem.is_featured}
                    onChange={(e) => setEditingItem({ ...editingItem, is_featured: e.target.checked })}
                  />
                  {' '} Mark as Featured
                </label>
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

export default CaseStudiesManager;
