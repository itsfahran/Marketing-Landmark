import React, { useState } from 'react';
import { FaPlus, FaTrash, FaStar } from 'react-icons/fa';
import './KeywordManager.css';

export default function KeywordManager({ keywords = [], onAdd, onDelete, onTogglePrimary }) {
  const [newKeyword, setNewKeyword] = useState('');

  const handleAdd = () => {
    if (newKeyword.trim()) {
      onAdd?.(newKeyword);
      setNewKeyword('');
    }
  };

  return (
    <div className="keyword-manager">
      <div className="keyword-header">
        <h3 className="keyword-title">SEO Keywords</h3>
        <span className="keyword-count">{keywords.length} keyword{keywords.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="keyword-input-group">
        <input
          type="text"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add a keyword..."
          className="keyword-input"
        />
        <button onClick={handleAdd} className="keyword-add-btn">
          <FaPlus /> Add
        </button>
      </div>

      {keywords.length > 0 ? (
        <div className="keywords-list">
          {keywords.map((kw, idx) => (
            <div key={idx} className={`keyword-item ${kw.is_primary ? 'primary' : ''}`}>
              <div className="keyword-content">
                <button
                  className="keyword-primary-btn"
                  onClick={() => onTogglePrimary?.(kw.id, !kw.is_primary)}
                  title={kw.is_primary ? 'Remove as primary' : 'Set as primary'}
                >
                  <FaStar className={kw.is_primary ? 'filled' : 'outline'} />
                </button>
                <div className="keyword-text">
                  <p className="keyword-name">{typeof kw === 'string' ? kw : kw.keyword}</p>
                  {kw.keyword_density && (
                    <small className="keyword-density">
                      Density: {kw.keyword_density}%
                    </small>
                  )}
                </div>
              </div>
              <button
                className="keyword-delete-btn"
                onClick={() => onDelete?.(kw.id || idx)}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="keywords-empty">
          <p>No keywords added yet</p>
          <small>Add keywords to help optimize your SEO</small>
        </div>
      )}

      <div className="keyword-tips">
        <strong>💡 Tip:</strong> Focus on 1-2 primary keywords and 3-5 secondary keywords for best results
      </div>
    </div>
  );
}
