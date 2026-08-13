import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import './AdminModule.css';

export default function AdminFAQs() {
  const [items, setItems] = useState([
    { id: 1, question: 'How long does SEO take?', answer: 'Results typically show within 2-3 months' },
    { id: 2, question: 'Do you guarantee rankings?', answer: 'No, but we have a 95% success rate' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ question: '', answer: '' });

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
    if (confirm('Delete this FAQ?')) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({ question: '', answer: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredItems = items.filter((item) => item.question.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="admin-module">
      <div className="module-header">
        <h2>FAQs</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <FaPlus /> New FAQ
        </button>
      </div>

      <div className="module-search">
        <FaSearch />
        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredItems.length > 0 ? (
        <div className="module-table">
          <div className="table-header">
            <div>Question</div>
            <div>Answer</div>
            <div>Actions</div>
          </div>
          {filteredItems.map((item) => (
            <div key={item.id} className="table-row">
              <div>
                <strong>{item.question}</strong>
              </div>
              <div>{item.answer.substring(0, 50)}...</div>
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
        <p className="no-data">No FAQs found</p>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? 'Edit FAQ' : 'New FAQ'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Question *</label>
                <input type="text" name="question" value={formData.question} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Answer *</label>
                <textarea name="answer" value={formData.answer} onChange={handleInputChange} rows="6" required />
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
