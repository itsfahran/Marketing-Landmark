import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '../../lib/supabase';
import { uploadImage } from '../../lib/imageUpload';
import './ItemManager.css';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaGripVertical, FaEye, FaEyeSlash } from 'react-icons/fa';

const NavbarManager = ({ onClose }) => {
  const supabase = getSupabaseClient();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editItem, setEditItem] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    loadNavbarItems();
  }, []);

  const loadNavbarItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('navbar_items')
        .select('*')
        .order('order_position', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error('Error loading navbar items:', err);
      alert('Error loading navbar items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    try {
      const newItem = {
        label: 'New Menu',
        url: '/',
        icon: '🔗',
        order_position: items.length,
        is_active: true,
        open_in_new_tab: false,
      };

      const { error } = await supabase
        .from('navbar_items')
        .insert([newItem]);

      if (error) throw error;
      loadNavbarItems();
    } catch (err) {
      console.error('Error adding item:', err);
      alert('Error adding item');
    }
  };

  const handleSaveItem = async (item) => {
    if (!item.label || !item.url) {
      alert('Please fill in label and URL');
      return;
    }

    try {
      if (item.id) {
        const { error } = await supabase
          .from('navbar_items')
          .update({
            label: item.label,
            url: item.url,
            icon: item.icon,
            icon_url: item.icon_url,
            order_position: item.order_position,
            is_active: item.is_active,
            open_in_new_tab: item.open_in_new_tab,
          })
          .eq('id', item.id);

        if (error) throw error;
      }

      setEditingId(null);
      loadNavbarItems();
    } catch (err) {
      console.error('Error saving item:', err);
      alert('Error saving item');
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

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;

    try {
      const { error } = await supabase
        .from('navbar_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadNavbarItems();
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Error deleting item');
    }
  };

  const handleToggleActive = async (item) => {
    try {
      const { error } = await supabase
        .from('navbar_items')
        .update({ is_active: !item.is_active })
        .eq('id', item.id);

      if (error) throw error;
      loadNavbarItems();
    } catch (err) {
      console.error('Error toggling active:', err);
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
      // Swap order positions
      await Promise.all([
        supabase
          .from('navbar_items')
          .update({ order_position: targetItem.order_position })
          .eq('id', draggedItem.id),
        supabase
          .from('navbar_items')
          .update({ order_position: draggedItem.order_position })
          .eq('id', targetItem.id),
      ]);

      setDraggedItem(null);
      loadNavbarItems();
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
          <h3>🔗 Manage Navbar Menu</h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <button
          className="add-btn"
          onClick={handleAddItem}
          style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FaPlus /> Add Menu Item
        </button>

        <div style={{ display: 'grid', gap: '15px' }}>
          {items.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(item)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(item)}
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                padding: 'var(--spacing-lg)',
                cursor: draggedItem?.id === item.id ? 'grabbing' : 'grab',
                opacity: draggedItem?.id === item.id ? 0.6 : item.is_active ? 1 : 0.5,
              }}
            >
              {editingId === item.id ? (
                <div>
                  <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      placeholder="Menu Label"
                      value={editItem.label || ''}
                      onChange={(e) => setEditItem({ ...editItem, label: e.target.value })}
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
                    <input
                      type="text"
                      placeholder="URL (e.g., /services, /about)"
                      value={editItem.url || ''}
                      onChange={(e) => setEditItem({ ...editItem, url: e.target.value })}
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
                      Icon (Custom Image - Optional)
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
                      <img src={editItem.icon_url} alt="icon preview" style={{ maxWidth: '40px', maxHeight: '40px', borderRadius: '8px' }} />
                    )}
                  </div>

                  <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={editItem.open_in_new_tab || false}
                        onChange={(e) => setEditItem({ ...editItem, open_in_new_tab: e.target.checked })}
                      />
                      Open in new tab
                    </label>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleSaveItem(editItem)}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <FaGripVertical style={{ color: 'var(--text-muted)', cursor: 'grab' }} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                        <span style={{ fontSize: '20px' }}>{item.icon}</span>
                        <strong>{item.label}</strong>
                        <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{item.url}</span>
                      </div>
                      {item.open_in_new_tab && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '0' }}>Opens in new tab</p>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleToggleActive(item)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: item.is_active ? 'var(--primary)' : 'var(--border)',
                        color: item.is_active ? 'white' : 'var(--text-primary)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                      title={item.is_active ? 'Hide menu item' : 'Show menu item'}
                    >
                      {item.is_active ? <FaEye /> : <FaEyeSlash />}
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setEditItem(item);
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
                      onClick={() => handleDeleteItem(item.id)}
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

export default NavbarManager;
