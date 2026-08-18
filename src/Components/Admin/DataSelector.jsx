import React from 'react';
import { FaChevronDown, FaSpinner } from 'react-icons/fa';
import './DataSelector.css';

export default function DataSelector({
  label,
  value,
  onChange,
  options = [],
  loading = false,
  placeholder = 'Select an option...',
  icon: Icon,
  hint
}) {
  return (
    <div className="data-selector">
      {label && <label className="selector-label">{label}</label>}
      <div className="selector-wrapper">
        {Icon && <div className="selector-icon"><Icon /></div>}
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="selector-input"
          disabled={loading}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.id || option.value} value={option.id || option.value}>
              {option.name || option.label}
              {option.role && ` (${option.role})`}
            </option>
          ))}
        </select>
        {loading ? (
          <div className="selector-spinner">
            <FaSpinner className="spinning" />
          </div>
        ) : (
          <FaChevronDown className="selector-chevron" />
        )}
      </div>
      {hint && <small className="selector-hint">{hint}</small>}
    </div>
  );
}
