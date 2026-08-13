import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import './AdminModule.css';

export default function AdminPortfolio() {
  const [items, setItems] = useState([
    { id: 1, title: 'E-commerce SEO', category: 'SEO', status: 'published' },
    { id: 2, title: 'SaaS Ranking', category: 'SEO', status: 'published' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', category: 'SEO', status: 'draft' });

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
    if (confirm('Delete this item?')) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({ title: '', category: 'SEO', status: 'draft' });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredItems = items.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="admin-module">
      <div className="module-header">
        <h2>Portfolio</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <FaPlus /> New Project
        </button>
      </div>

      <div className="module-search">
        <FaSearch />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredItems.length > 0 ? (
        <div className="module-table">
          <div className="table-header">
            <div>Title</div>
            <div>Category</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
          {filteredItems.map((item) => (
            <div key={item.id} className="table-row">
              <div>{item.title}</div>
              <div>{item.category}</div>
              <div>
                <span className={`status ${item.status}`}>{item.status}</span>
              </div>
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
        <p className="no-data">No projects found</p>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? 'Edit Project' : 'New Project'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange}>
                  <option>SEO</option>
                  <option>GEO</option>
                  <option>Web Dev</option>
                  <option>Design</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
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
