import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import './AdminModule.css';

export default function AdminBrands() {
  const [items, setItems] = useState([
    { id: 1, name: 'Brand 1', website: 'https://brand1.com' },
    { id: 2, name: 'Brand 2', website: 'https://brand2.com' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', website: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setItems(items.map((i) => (i.id === editingId ? { ...formData, id: editingId } : i)));
    } else {
      setItems([...items, { ...formData, id: Date.now() }]);
    }
    resetForm();
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this brand?')) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({ name: '', website: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredItems = items.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="admin-module">
      <div className="module-header">
        <h2>Brands</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <FaPlus /> New Brand
        </button>
      </div>

      <div className="module-search">
        <FaSearch />
        <input
          type="text"
          placeholder="Search brands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredItems.length > 0 ? (
        <div className="module-table">
          <div className="table-header">
            <div>Name</div>
            <div>Website</div>
            <div>Actions</div>
          </div>
          {filteredItems.map((item) => (
            <div key={item.id} className="table-row">
              <div>{item.name}</div>
              <div>{item.website}</div>
              <div className="actions">
                <button onClick={() => handleEdit(item)} className="action-btn edit">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(item.id)} className="action-btn delete">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-data">No brands found</p>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? 'Edit Brand' : 'New Brand'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Brand Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
