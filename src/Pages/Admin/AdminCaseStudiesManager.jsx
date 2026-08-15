import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '../../lib/supabase';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaStar } from 'react-icons/fa';
import './AdminCaseStudiesManager.css';

const AdminCaseStudiesManager = () => {
  const supabase = getSupabaseClient();
  const [items, setItems] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [currentCaseStudiesId, setCurrentCaseStudiesId] = useState(null);

  useEffect(() => {
    loadCaseStudies();
  }, []);

  const loadCaseStudies = async () => {
    try {
      const { data } = await supabase
        .from('component_casestudies')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setCaseStudies(data);
        if (data.length > 0) {
          loadItemsForCaseStudies(data[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading case studies:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadItemsForCaseStudies = async (caseStudiesId) => {
    try {
      setLoading(true);
      setCurrentCaseStudiesId(caseStudiesId);
      const { data } = await supabase
        .from('component_casestudies_items')
        .select('*')
        .eq('casestudies_id', caseStudiesId)
        .order('sort_order');

      setItems(data || []);
    } catch (err) {
      console.error('Error loading case study items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    if (!currentCaseStudiesId) {
      alert('Please select a case studies component first');
      return;
    }

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
    if (!item.title || !item.image_url) {
      alert('Please fill title and image');
      return;
    }

    try {
      if (item.isNew) {
        await supabase.from('component_casestudies_items').insert({
          casestudies_id: currentCaseStudiesId,
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
      loadItemsForCaseStudies(currentCaseStudiesId);
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
      loadItemsForCaseStudies(currentCaseStudiesId);
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

  if (loading && !currentCaseStudiesId) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-case-studies-manager">
      <h2>Case Studies Manager</h2>

      <div className="case-studies-container">
        {/* Case Studies List */}
        <div className="case-studies-list-sidebar">
          <h3>Case Studies</h3>
          {caseStudies.length === 0 ? (
            <p className="no-items">No case studies components found. Add them via Page Builder first.</p>
          ) : (
            caseStudies.map((cs) => (
              <button
                key={cs.id}
                className={`case-studies-button ${currentCaseStudiesId === cs.id ? 'active' : ''}`}
                onClick={() => loadItemsForCaseStudies(cs.id)}
              >
                <span className="case-studies-info">
                  <div className="case-studies-name">Case Studies</div>
                  <div className="case-studies-template">{cs.template}</div>
                </span>
              </button>
            ))
          )}
        </div>

        {/* Items List */}
        <div className="items-container">
          {currentCaseStudiesId ? (
            <>
              <div className="items-header">
                <h3>Projects</h3>
                <button className="add-btn" onClick={handleAddItem}>
                  <FaPlus /> Add Case Study
                </button>
              </div>

              {loading ? (
                <div className="loading">Loading...</div>
              ) : (
                <div className="items-list">
                  {items.length === 0 ? (
                    <p className="no-items">No case studies yet. Add your first!</p>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="item-row">
                        <div className="item-info">
                          {item.image_url && (
                            <img src={item.image_url} alt={item.title} className="item-thumbnail" />
                          )}
                          <div>
                            <strong>{item.title}</strong>
                            <p>{item.category} {item.is_featured && <FaStar style={{ color: '#ffd700' }} />}</p>
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
            <div className="no-selection">Select a case studies component to manage items</div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Edit Case Study</h4>
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

export default AdminCaseStudiesManager;
