import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '../../lib/supabase';
import './ItemManager.css';
import { FaEdit, FaTrash, FaPlus, FaGripVertical, FaSave, FaTimes } from 'react-icons/fa';

const CMSManager = ({ cmsData, pageId, template, onClose }) => {
  const supabase = getSupabaseClient();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const cmsId = cmsData?.id;

  useEffect(() => {
    if (cmsId) {
      loadItems();
    }
  }, [cmsId]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('component_cms_items')
        .select('*')
        .eq('cms_id', cmsId)
        .order('sort_order');

      setItems(data || []);
    } catch (err) {
      console.error('Error loading CMS items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    const newItem = {
      id: `temp_${Date.now()}`,
      title: '',
      icon_url: '',
      sort_order: items.length,
      isNew: true,
    };
    setItems([...items, newItem]);
    setEditingItem(newItem);
  };

  const handleSaveItem = async (item) => {
    if (!cmsId) {
      alert('Please save the CMS component first');
      return;
    }

    if (!item.title || !item.icon_url) {
      alert('Please fill all fields');
      return;
    }

    try {
      if (item.isNew) {
        await supabase.from('component_cms_items').insert({
          cms_id: cmsId,
          title: item.title,
          icon_url: item.icon_url,
          sort_order: item.sort_order,
        });
      } else {
        await supabase
          .from('component_cms_items')
          .update({
            title: item.title,
            icon_url: item.icon_url,
            sort_order: item.sort_order,
          })
          .eq('id', item.id);
      }

      setEditingItem(null);
      loadItems();
      alert('Item saved successfully!');
    } catch (err) {
      console.error('Error saving item:', err);
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Delete this item?')) return;

    try {
      await supabase.from('component_cms_items').delete().eq('id', itemId);
      loadItems();
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Error deleting item');
    }
  };

  const handleIconUpload = async (file, item) => {
    if (!file) return;

    try {
      const fileName = `cms-${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('portfolio-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicUrl } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(fileName);

      setEditingItem({
        ...editingItem,
        icon_url: publicUrl.publicUrl,
      });
    } catch (err) {
      console.error('Error uploading icon:', err);
      alert('Error uploading icon');
    }
  };

  if (!cmsId) {
    return (
      <div className="edit-modal-overlay">
        <div className="edit-modal">
          <h4>Error</h4>
          <p>Please save the CMS component first</p>
          <button className="cancel-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h4>Manage CMS Items ({template})</h4>
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
                <p className="no-items">No items yet. Add your first CMS item!</p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="item-card">
                    <div className="item-info">
                      {item.icon_url && <img src={item.icon_url} alt={item.title} style={{ width: '40px', height: '40px', marginRight: '10px' }} />}
                      <strong>{item.title || 'Untitled'}</strong>
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
              <FaPlus /> Add New Item
            </button>
          </>
        )}

        {editingItem && (
          <div className="edit-modal-overlay">
            <div className="edit-modal">
              <h4>Edit CMS Item</h4>

              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, title: e.target.value })
                  }
                  placeholder="e.g., WordPress"
                />
              </div>

              <div className="form-group">
                <label>Icon URL or Upload *</label>
                {editingItem.icon_url && (
                  <div style={{ marginBottom: '10px' }}>
                    <img src={editingItem.icon_url} alt="Preview" style={{ width: '80px', height: '80px' }} />
                  </div>
                )}
                <input
                  type="text"
                  value={editingItem.icon_url}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, icon_url: e.target.value })
                  }
                  placeholder="Icon URL or upload below"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      handleIconUpload(e.target.files[0], editingItem);
                    }
                  }}
                  style={{ marginTop: '10px' }}
                />
              </div>

              <div className="modal-actions">
                <button
                  className="save-btn"
                  onClick={() => handleSaveItem(editingItem)}
                >
                  <FaSave /> Save Item
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CMSManager;
