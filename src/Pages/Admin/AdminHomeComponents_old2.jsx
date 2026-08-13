import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '../../lib/supabase';
import { FaSave, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { uploadImage } from '../../lib/imageUpload';
import '../../styles/admin-design-tokens.css';

const TABS = [
  { id: 'hero', label: 'Hero' },
  { id: 'services', label: 'Services' },
  { id: 'process', label: 'Process' },
  { id: 'about', label: 'About' },
  { id: 'hire', label: 'Hire Me' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'brands', label: 'Brands' },
  { id: 'choose', label: 'Why Choose' },
  { id: 'contact', label: 'Contact' },
];

// Reusable Form Components
const FormInput = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div style={{ marginBottom: 'var(--spacing-lg)' }}>
    <label
      style={{
        display: 'block',
        fontSize: 'var(--font-size-sm)',
        fontWeight: 600,
        color: 'var(--text-primary)',
        marginBottom: 'var(--spacing-sm)',
      }}
    >
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: 'var(--spacing-md)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-primary)',
        backgroundColor: 'var(--surface)',
        transition: 'border-color var(--transition-fast)',
      }}
      onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
      onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
    />
  </div>
);

const FormTextarea = ({ label, value, onChange, placeholder }) => (
  <div style={{ marginBottom: 'var(--spacing-lg)' }}>
    <label
      style={{
        display: 'block',
        fontSize: 'var(--font-size-sm)',
        fontWeight: 600,
        color: 'var(--text-primary)',
        marginBottom: 'var(--spacing-sm)',
      }}
    >
      {label}
    </label>
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: 'var(--spacing-md)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-primary)',
        backgroundColor: 'var(--surface)',
        minHeight: '120px',
        fontFamily: 'inherit',
        transition: 'border-color var(--transition-fast)',
      }}
      onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
      onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
    />
  </div>
);

const FormButton = ({ children, variant = 'primary', onClick, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--spacing-sm)',
      padding: 'var(--spacing-md) var(--spacing-lg)',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      fontSize: 'var(--font-size-sm)',
      fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all var(--transition-fast)',
      backgroundColor: variant === 'primary' ? 'var(--primary)' : variant === 'danger' ? 'var(--danger)' : 'var(--background)',
      color: variant === 'primary' || variant === 'danger' ? 'white' : 'var(--text-primary)',
      opacity: disabled ? 0.6 : 1,
    }}
    onMouseEnter={(e) => {
      if (!disabled) {
        e.target.style.backgroundColor = variant === 'primary' ? 'var(--primary-hover)' : variant === 'danger' ? 'var(--danger)' : 'var(--border)';
      }
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = variant === 'primary' ? 'var(--primary)' : variant === 'danger' ? 'var(--danger)' : 'var(--background)';
    }}
  >
    {children}
  </button>
);

// Hero Editor Component
const HeroEditor = ({ data, onSave }) => {
  const [form, setForm] = useState(data || {});
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave('hero', form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Heading"
        value={form.heading || ''}
        onChange={(e) => setForm({ ...form, heading: e.target.value })}
        placeholder="Enter hero heading"
      />
      <FormTextarea
        label="Description"
        value={form.description || ''}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Enter hero description"
      />
      <FormInput
        label="CTA Text"
        value={form.cta_text || ''}
        onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
        placeholder="e.g., Get Started"
      />
      <FormInput
        label="CTA Link"
        value={form.cta_link || ''}
        onChange={(e) => setForm({ ...form, cta_link: e.target.value })}
        placeholder="e.g., /contact"
      />
      <FormButton disabled={saving}>
        <FaSave /> {saving ? 'Saving...' : 'Save Hero'}
      </FormButton>
    </form>
  );
};

// List Editor Component
const ListEditor = ({ title, data, fields, tableName, onAdd, onDelete, onUpdate }) => {
  const [items, setItems] = useState(data || []);
  const [newItem, setNewItem] = useState(fields.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {}));
  const [editId, setEditId] = useState(null);
  const [editItem, setEditItem] = useState({});
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file, fieldKey, isNew = true) => {
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadImage(file);
      if (isNew) {
        setNewItem({ ...newItem, [fieldKey]: url });
      } else {
        setEditItem({ ...editItem, [fieldKey]: url });
      }
    } catch (error) {
      alert('Image upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async () => {
    if (!newItem[fields[0].key]) return alert(`Please enter ${fields[0].label}`);
    await onAdd(tableName, newItem);
    setItems([...items, newItem]);
    setNewItem(fields.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {}));
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this item?')) {
      await onDelete(tableName, id);
      setItems(items.filter((i) => i.id !== id));
    }
  };

  const handleEditStart = (item) => {
    setEditId(item.id);
    setEditItem({ ...item });
  };

  const handleEditSave = async (id) => {
    if (!editItem[fields[0].key]) return alert(`Please enter ${fields[0].label}`);
    await onUpdate(tableName, id, editItem);
    setItems(items.map((i) => (i.id === id ? editItem : i)));
    setEditId(null);
  };

  const renderField = (field, isNew = true) => {
    const value = isNew ? newItem[field.key] : editItem[field.key];
    const setter = isNew ? setNewItem : setEditItem;

    if (field.type === 'image') {
      return (
        <div key={field.key} style={{ marginBottom: 'var(--spacing-lg)' }}>
          <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--spacing-sm)' }}>
            {field.label}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files?.[0], field.key, isNew)}
            disabled={uploading}
            style={{
              display: 'block',
              width: '100%',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              cursor: uploading ? 'not-allowed' : 'pointer',
            }}
          />
          {uploading && <p style={{ marginTop: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>Uploading...</p>}
          {value && (
            <div style={{ marginTop: 'var(--spacing-md)' }}>
              <img src={value} alt="preview" style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }} />
            </div>
          )}
        </div>
      );
    } else if (field.type === 'textarea') {
      return (
        <FormTextarea
          key={field.key}
          label={field.label}
          value={value}
          onChange={(e) => setter({ ...setter, [field.key]: e.target.value })}
          placeholder={field.label}
        />
      );
    } else {
      return (
        <FormInput
          key={field.key}
          label={field.label}
          value={value}
          onChange={(e) => setter({ ...setter, [field.key]: e.target.value })}
          placeholder={field.label}
        />
      );
    }
  };

  return (
    <div>
      {/* Add New Section */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-xl)',
        }}
      >
        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--spacing-lg)' }}>
          Add New {title}
        </h3>
        {fields.map((field) => renderField(field, true))}
        <FormButton onClick={handleAdd} disabled={uploading}>
          <FaPlus /> Add {title}
        </FormButton>
      </div>

      {/* Items List */}
      <div>
        {items.length === 0 ? (
          <div
            style={{
              padding: 'var(--spacing-2xl)',
              textAlign: 'center',
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            No {title.toLowerCase()} yet. Add one above!
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'var(--surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  padding: 'var(--spacing-lg)',
                }}
              >
                {editId === item.id ? (
                  <div>
                    {fields.map((field) => renderField(field, false))}
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
                      <FormButton onClick={() => handleEditSave(item.id)} disabled={uploading}>
                        <FaSave /> Save
                      </FormButton>
                      <FormButton onClick={() => setEditId(null)}>Cancel</FormButton>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--spacing-sm)' }}>
                        {item[fields[0].key]}
                      </h4>
                      {fields.slice(1, 3).map((field) => (
                        <p key={field.key} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
                          <strong>{field.label}:</strong> {String(item[field.key]).substring(0, 50)}...
                        </p>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                      <FormButton onClick={() => handleEditStart(item)}>
                        <FaEdit />
                      </FormButton>
                      <FormButton onClick={() => handleDelete(item.id)} variant="danger">
                        <FaTrash />
                      </FormButton>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Component
export default function AdminHomeComponents() {
  const [activeTab, setActiveTab] = useState('hero');
  const [allData, setAllData] = useState({});
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseClient();

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const tables = ['hero', 'services', 'process_steps', 'about', 'hire_gigs', 'portfolio_items', 'testimonials', 'brands', 'choose_features', 'contact'];
      const data = {};

      for (const table of tables) {
        const { data: result } = await supabase.from(table).select('*');
        data[table] = result || [];
      }

      setAllData(data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (table, data) => {
    try {
      const { error } = await supabase.from(table).upsert([data]);
      if (error) throw error;
      loadAllData();
      alert('Saved successfully!');
    } catch (error) {
      alert('Error saving: ' + error.message);
    }
  };

  const handleAdd = async (table, data) => {
    try {
      const { error } = await supabase.from(table).insert([data]);
      if (error) throw error;
      loadAllData();
      alert('Added successfully!');
    } catch (error) {
      alert('Error adding: ' + error.message);
    }
  };

  const handleDelete = async (table, id) => {
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      loadAllData();
    } catch (error) {
      alert('Error deleting: ' + error.message);
    }
  };

  const handleUpdate = async (table, id, data) => {
    try {
      const { error } = await supabase.from(table).update(data).eq('id', id);
      if (error) throw error;
      loadAllData();
    } catch (error) {
      alert('Error updating: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 'var(--spacing-2xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading...
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--text-primary)' }}>Home Components</h1>
        <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--text-secondary)', marginTop: 'var(--spacing-sm)' }}>
          Manage all sections of your home page
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--spacing-sm)',
          borderBottom: '1px solid var(--border)',
          overflowX: 'auto',
          marginBottom: 'var(--spacing-2xl)',
          paddingBottom: 'var(--spacing-md)',
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: 'var(--spacing-md) var(--spacing-lg)',
              borderRadius: '0',
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: 'var(--font-size-sm)',
              fontWeight: activeTab === tab.id ? 600 : 500,
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : 'transparent',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => !activeTab === tab.id && (e.target.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => !activeTab === tab.id && (e.target.style.color = 'var(--text-secondary)')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'hero' && <HeroEditor data={allData.hero?.[0]} onSave={handleSave} />}

        {activeTab === 'services' && (
          <ListEditor
            title="Service"
            data={allData.services}
            fields={[
              { key: 'name', label: 'Service Name' },
              { key: 'description', label: 'Description', type: 'textarea' },
              { key: 'icon_name', label: 'Icon Name' },
            ]}
            tableName="services"
            onAdd={handleAdd}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        )}

        {activeTab === 'process' && (
          <ListEditor
            title="Step"
            data={allData.process_steps}
            fields={[
              { key: 'title', label: 'Step Title' },
              { key: 'description', label: 'Description', type: 'textarea' },
              { key: 'icon_name', label: 'Icon Name' },
            ]}
            tableName="process_steps"
            onAdd={handleAdd}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        )}

        {/* Add other tabs similarly */}
        {!['hero', 'services', 'process'].includes(activeTab) && (
          <div
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              padding: 'var(--spacing-2xl)',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} editor coming soon
          </div>
        )}
      </div>
    </div>
  );
}
