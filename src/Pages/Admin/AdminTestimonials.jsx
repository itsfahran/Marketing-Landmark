import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import './AdminModule.css';

export default function AdminTestimonials() {
  const [items, setItems] = useState([
    { id: 1, name: 'Ahmed Khan', role: 'E-commerce Owner', rating: 5, platform: 'fiverr' },
    { id: 2, name: 'Fatima Malik', role: 'SaaS Founder', rating: 5, platform: 'upwork' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', role: '', rating: 5, platform: 'fiverr' });

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
    if (confirm('Delete this testimonial?')) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({ name: '', role: '', rating: 5, platform: 'fiverr' });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredItems = items.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="admin-module">
      <div className="module-header">
        <h2>Testimonials</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <FaPlus /> New Testimonial
        </button>
      </div>

      <div className="module-search">
        <FaSearch />
        <input
          type="text"
          placeholder="Search testimonials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredItems.length > 0 ? (
        <div className="module-table">
          <div className="table-header">
            <div>Name</div>
            <div>Role</div>
            <div>Rating</div>
            <div>Platform</div>
            <div>Actions</div>
          </div>
          {filteredItems.map((item) => (
            <div key={item.id} className="table-row">
              <div>{item.name}</div>
              <div>{item.role}</div>
              <div>{'⭐'.repeat(item.rating)}</div>
              <div>{item.platform}</div>
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
        <p className="no-data">No testimonials found</p>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? 'Edit Testimonial' : 'New Testimonial'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Client Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Role</label>
                <input type="text" name="role" value={formData.role} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Rating</label>
                <select name="rating" value={formData.rating} onChange={handleInputChange}>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                </select>
              </div>
              <div className="form-group">
                <label>Platform</label>
                <select name="platform" value={formData.platform} onChange={handleInputChange}>
                  <option>fiverr</option>
                  <option>upwork</option>
                  <option>google</option>
                  <option>linkedin</option>
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
