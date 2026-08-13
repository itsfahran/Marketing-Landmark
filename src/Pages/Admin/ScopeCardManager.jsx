import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '../../lib/supabase';
import './ItemManager.css';
import { FaEdit, FaTrash, FaPlus, FaGripVertical, FaSave, FaTimes } from 'react-icons/fa';

const ScopeCardManager = ({ scopeData, pageId, template, onClose }) => {
  const supabase = getSupabaseClient();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCard, setEditingCard] = useState(null);
  const [draggedCard, setDraggedCard] = useState(null);
  const scopeId = scopeData?.id;

  useEffect(() => {
    if (scopeId) {
      loadCards();
    }
  }, [scopeId]);

  const loadCards = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('component_scope_cards')
        .select('*')
        .eq('scope_id', scopeId)
        .order('sort_order');

      setCards(data || []);
    } catch (err) {
      console.error('Error loading cards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = () => {
    const newCard = {
      id: `temp_${Date.now()}`,
      number: String(cards.length + 1).padStart(2, '0'),
      title: '',
      description: '',
      icon_name: '',
      icon_url: '',
      sort_order: cards.length,
      isNew: true,
    };
    setCards([...cards, newCard]);
    setEditingCard(newCard);
  };

  const handleSaveCard = async (card) => {
    if (!scopeId) {
      alert('Please save the Scope component first');
      return;
    }

    try {
      if (card.isNew) {
        await supabase.from('component_scope_cards').insert({
          scope_id: scopeId,
          number: card.number,
          title: card.title,
          description: card.description,
          icon_name: card.icon_name,
          icon_url: card.icon_url,
          sort_order: card.sort_order,
        });
      } else {
        await supabase
          .from('component_scope_cards')
          .update({
            number: card.number,
            title: card.title,
            description: card.description,
            icon_name: card.icon_name,
            icon_url: card.icon_url,
            sort_order: card.sort_order,
          })
          .eq('id', card.id);
      }

      setEditingCard(null);
      loadCards();
    } catch (err) {
      console.error('Error saving card:', err);
      alert('Error saving card: ' + err.message);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm('Delete this card?')) return;

    try {
      await supabase.from('component_scope_cards').delete().eq('id', cardId);
      loadCards();
    } catch (err) {
      console.error('Error deleting card:', err);
      alert('Error deleting card');
    }
  };

  const handleReorder = (fromIndex, toIndex) => {
    const newCards = [...cards];
    const [movedCard] = newCards.splice(fromIndex, 1);
    newCards.splice(toIndex, 0, movedCard);

    // Update sort_order
    const updatedCards = newCards.map((card, idx) => ({
      ...card,
      sort_order: idx,
    }));

    setCards(updatedCards);
    setDraggedCard(null);

    // Save all orders
    updatedCards.forEach(card => {
      if (!card.isNew) {
        supabase
          .from('component_scope_cards')
          .update({ sort_order: card.sort_order })
          .eq('id', card.id)
          .catch(err => console.error('Error updating order:', err));
      }
    });
  };

  return (
    <div className="item-manager-modal">
      <div className="item-manager-content">
        <div className="item-manager-header">
          <h3>Manage Scope Cards ({template})</h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading cards...</div>
        ) : (
          <>
            <div className="cards-list">
              {cards.length === 0 ? (
                <p className="no-items">No cards yet. Add your first card!</p>
              ) : (
                cards.map((card, index) => (
                  <div
                    key={card.id}
                    className="card-item"
                    draggable
                    onDragStart={() => setDraggedCard(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (draggedCard !== null && draggedCard !== index) {
                        handleReorder(draggedCard, index);
                      }
                    }}
                  >
                    <div className="card-content">
                      <FaGripVertical className="drag-icon" />
                      <div className="card-info">
                        <strong>{card.number}</strong>
                        <span>{card.title || 'Untitled'}</span>
                      </div>
                    </div>

                    <div className="card-actions">
                      <button
                        className="edit-btn"
                        onClick={() => setEditingCard(card)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteCard(card.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button className="add-btn" onClick={handleAddCard}>
              <FaPlus /> Add New Card
            </button>
          </>
        )}

        {editingCard && (
          <div className="edit-modal-overlay">
            <div className="edit-modal">
              <h4>Edit Card</h4>

              <div className="form-group">
                <label>Number</label>
                <input
                  type="text"
                  value={editingCard.number}
                  onChange={(e) =>
                    setEditingCard({ ...editingCard, number: e.target.value })
                  }
                  placeholder="01"
                  maxLength="2"
                />
              </div>

              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={editingCard.title}
                  onChange={(e) =>
                    setEditingCard({ ...editingCard, title: e.target.value })
                  }
                  placeholder="Card title"
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={editingCard.description}
                  onChange={(e) =>
                    setEditingCard({ ...editingCard, description: e.target.value })
                  }
                  placeholder="Card description"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Icon Name (e.g., FaFileAlt)</label>
                <input
                  type="text"
                  value={editingCard.icon_name}
                  onChange={(e) =>
                    setEditingCard({ ...editingCard, icon_name: e.target.value })
                  }
                  placeholder="React icon name"
                />
              </div>

              <div className="form-group">
                <label>Icon Image URL</label>
                <input
                  type="url"
                  value={editingCard.icon_url}
                  onChange={(e) =>
                    setEditingCard({ ...editingCard, icon_url: e.target.value })
                  }
                  placeholder="Or provide image URL"
                />
              </div>

              <div className="modal-actions">
                <button
                  className="save-btn"
                  onClick={() => handleSaveCard(editingCard)}
                >
                  <FaSave /> Save Card
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setEditingCard(null)}
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

export default ScopeCardManager;
