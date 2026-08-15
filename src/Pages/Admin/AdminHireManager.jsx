import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '../../lib/supabase';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaArrowLeft } from 'react-icons/fa';
import './AdminHireManager.css';

const AdminHireManager = () => {
  const supabase = getSupabaseClient();
  const [items, setItems] = useState([]);
  const [pages, setPages] = useState([]);
  const [selectedPageTemplate, setSelectedPageTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [currentHireId, setCurrentHireId] = useState(null);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const { data } = await supabase
        .from('component_hire')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setPages(data);
        if (data.length > 0) {
          loadItemsForHire(data[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading pages:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadItemsForHire = async (hireId) => {
    try {
      setLoading(true);
      setCurrentHireId(hireId);
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
    if (!currentHireId) {
      alert('Please select a hire component first');
      return;
    }

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
    if (!item.title || !item.image_url) {
      alert('Please fill title and image');
      return;
    }

    try {
      if (item.isNew) {
        await supabase.from('component_hire_items').insert({
          hire_id: currentHireId,
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
      loadItemsForHire(currentHireId);
      alert('Gig saved!');
    } catch (err) {
      console.error('Error saving:', err);
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Delete this gig?')) return;

    try {
      await supabase.from('component_hire_items').delete().eq('id', itemId);
      loadItemsForHire(currentHireId);
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

  if (loading && !currentHireId) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-hire-manager">
      <h2>Hire/Gigs Manager</h2>

      <div className="hire-manager-container">
        {/* Pages List */}
        <div className="pages-list-sidebar">
          <h3>Hire Components</h3>
          {pages.length === 0 ? (
            <p className="no-items">No hire components found. Add them via Page Builder first.</p>
          ) : (
            pages.map((page) => (
              <button
                key={page.id}
                className={`page-button ${currentHireId === page.id ? 'active' : ''}`}
                onClick={() => loadItemsForHire(page.id)}
              >
                <span className="page-info">
                  <div className="page-name">Page Component</div>
                  <div className="page-template">{page.template}</div>
                </span>
              </button>
            ))
          )}
        </div>

        {/* Items List */}
        <div className="items-container">
          {currentHireId ? (
            <>
              <div className="items-header">
                <h3>Gigs</h3>
                <button className="add-btn" onClick={handleAddItem}>
                  <FaPlus /> Add New Gig
                </button>
              </div>

              {loading ? (
                <div className="loading">Loading...</div>
              ) : (
                <div className="items-list">
                  {items.length === 0 ? (
                    <p className="no-items">No gigs yet. Add your first!</p>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="item-row">
                        <div className="item-info">
                          {item.image_url && (
                            <img src={item.image_url} alt={item.title} className="item-thumbnail" />
                          )}
                          <div>
                            <strong>{item.title}</strong>
                            <p>⭐ {item.rating} ({item.review_count} reviews) • {item.price_label}</p>
                          </div>
                        </div>

                        <div className="item-actions">
                          <button className="edit-btn" onClick={() => setEditingItem(item)}>
                            <FaEdit />
                          </button>
                          <button className="delete-btn" onClick={() => handleDeleteItem(item.id)}>
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="no-selection">Select a hire component to manage items</div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Edit Gig</h4>
              <button className="close-btn" onClick={() => setEditingItem(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
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
                {editingItem.image_url && (
                  <img src={editingItem.image_url} alt="Preview" className="image-preview" />
                )}
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
            </div>

            <div className="modal-footer">
              <button className="save-btn" onClick={() => handleSaveItem(editingItem)}>
                <FaSave /> Save
              </button>
              <button className="cancel-btn" onClick={() => setEditingItem(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHireManager;
