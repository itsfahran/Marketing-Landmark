import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '../../lib/supabase';
import { FaSave, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { uploadImage } from '../../lib/imageUpload';
import '../../styles/admin-design-tokens.css';

// Reusable Components
const FormInput = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div style={{ marginBottom: 'var(--spacing-lg)' }}>
    <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--spacing-sm)' }}>
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
      }}
      onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
      onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
    />
  </div>
);

const FormTextarea = ({ label, value, onChange, placeholder }) => (
  <div style={{ marginBottom: 'var(--spacing-lg)' }}>
    <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--spacing-sm)' }}>
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
        minHeight: '120px',
        fontFamily: 'inherit',
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
      backgroundColor: variant === 'primary' ? 'var(--primary)' : 'var(--danger)',
      color: 'white',
      opacity: disabled ? 0.6 : 1,
    }}
    onMouseEnter={(e) => !disabled && (e.target.style.backgroundColor = variant === 'primary' ? 'var(--primary-hover)' : 'var(--danger)')}
    onMouseLeave={(e) => (e.target.style.backgroundColor = variant === 'primary' ? 'var(--primary)' : 'var(--danger)')}
  >
    {children}
  </button>
);

export default function AdminPortfolioPage() {
  const [activeTab, setActiveTab] = useState('hero');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseClient();

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const queries = {
        hero: () => supabase.from('portfolio_page_hero').select('*').single(),
        categories: () => supabase.from('portfolio_categories').select('*').order('sort_order'),
        projects: () => supabase.from('portfolio_projects').select('*').order('sort_order'),
      };

      const result = await queries[activeTab]();
      setData({ [activeTab]: result.data });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (table, formData) => {
    try {
      const { error } = await supabase.from(table).upsert([formData]);
      if (error) throw error;
      alert('Saved!');
      loadData();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleAdd = async (table, item) => {
    try {
      const { error } = await supabase.from(table).insert([item]);
      if (error) throw error;
      loadData();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleDelete = async (table, id) => {
    if (!confirm('Delete?')) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      loadData();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleUpdate = async (table, id, updates) => {
    try {
      const { error } = await supabase.from(table).update(updates).eq('id', id);
      if (error) throw error;
      loadData();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  if (loading) {
    return <div style={{ padding: 'var(--spacing-2xl)', color: 'var(--text-muted)', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--text-primary)' }}>Portfolio Page</h1>
        <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--text-secondary)', marginTop: 'var(--spacing-sm)' }}>
          Manage portfolio page sections
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', borderBottom: '1px solid var(--border)', marginBottom: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-md)' }}>
        {['hero', 'categories', 'projects'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: 'var(--spacing-md) var(--spacing-lg)',
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: 'var(--font-size-sm)',
              fontWeight: activeTab === tab ? 600 : 500,
              color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              borderBottom: activeTab === tab ? '2px solid var(--primary)' : 'transparent',
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'hero' && data.hero && (
        <HeroEditor data={data.hero} onSave={(d) => handleSave('portfolio_page_hero', d)} />
      )}

      {activeTab === 'categories' && (
        <CategoriesEditor items={data.categories || []} onAdd={handleAdd} onDelete={handleDelete} onUpdate={handleUpdate} />
      )}

      {activeTab === 'projects' && (
        <ProjectsEditor items={data.projects || []} onAdd={handleAdd} onDelete={handleDelete} onUpdate={handleUpdate} />
      )}
    </div>
  );
}

const HeroEditor = ({ data, onSave }) => {
  const [form, setForm] = useState(data || {});

  return (
    <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 'var(--spacing-lg)' }}>
      <FormInput label="Heading" value={form.heading || ''} onChange={(e) => setForm({ ...form, heading: e.target.value })} />
      <FormTextarea label="Description" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <FormButton onClick={() => onSave(form)}>
        <FaSave /> Save Hero
      </FormButton>
    </div>
  );
};

const CategoriesEditor = ({ items, onAdd, onDelete, onUpdate }) => {
  const [newItem, setNewItem] = useState({ name: '', sort_order: (items?.length || 0) + 1 });
  const [editId, setEditId] = useState(null);
  const [editItem, setEditItem] = useState({});

  return (
    <div>
      <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-lg)' }}>Add Category</h3>
        <FormInput label="Category Name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g., Web Design" />
        <FormButton onClick={() => { onAdd('portfolio_categories', newItem); setNewItem({ name: '', sort_order: (items?.length || 0) + 1 }); }}>
          <FaPlus /> Add Category
        </FormButton>
      </div>

      <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        {items.map((item) => (
          <div key={item.id} style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 'var(--spacing-lg)' }}>
            {editId === item.id ? (
              <div>
                <FormInput label="Name" value={editItem.name} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} />
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                  <FormButton onClick={() => { onUpdate('portfolio_categories', item.id, editItem); setEditId(null); }}>
                    <FaSave /> Save
                  </FormButton>
                  <FormButton onClick={() => setEditId(null)}>Cancel</FormButton>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>{item.name}</h4>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                  <FormButton onClick={() => { setEditId(item.id); setEditItem(item); }}>
                    <FaEdit />
                  </FormButton>
                  <FormButton variant="danger" onClick={() => onDelete('portfolio_categories', item.id)}>
                    <FaTrash />
                  </FormButton>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ProjectsEditor = ({ items, onAdd, onDelete, onUpdate }) => {
  const [newItem, setNewItem] = useState({ title: '', category: '', description: '', image_url: '', sort_order: (items?.length || 0) + 1 });
  const [editId, setEditId] = useState(null);
  const [editItem, setEditItem] = useState({});
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file, isNew) => {
    try {
      setUploading(true);
      const url = await uploadImage(file);
      if (isNew) setNewItem({ ...newItem, image_url: url });
      else setEditItem({ ...editItem, image_url: url });
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-lg)' }}>Add Project</h3>
        <FormInput label="Title" value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} placeholder="Project title" />
        <FormInput label="Category" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} placeholder="e.g., Web Design" />
        <FormTextarea label="Description" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} placeholder="Project description" />
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>Image</label>
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0], true)} disabled={uploading} />
          {newItem.image_url && <img src={newItem.image_url} alt="preview" style={{ maxWidth: '100px', marginTop: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }} />}
        </div>
        <FormButton onClick={() => { onAdd('portfolio_projects', newItem); setNewItem({ title: '', category: '', description: '', image_url: '', sort_order: (items?.length || 0) + 1 }); }} disabled={uploading}>
          <FaPlus /> Add Project
        </FormButton>
      </div>

      <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        {items.map((item) => (
          <div key={item.id} style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 'var(--spacing-lg)' }}>
            {editId === item.id ? (
              <div>
                <FormInput label="Title" value={editItem.title} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })} />
                <FormInput label="Category" value={editItem.category} onChange={(e) => setEditItem({ ...editItem, category: e.target.value })} />
                <FormTextarea label="Description" value={editItem.description} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} />
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>Image</label>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0], false)} disabled={uploading} />
                  {editItem.image_url && <img src={editItem.image_url} alt="preview" style={{ maxWidth: '100px', marginTop: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }} />}
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                  <FormButton onClick={() => { onUpdate('portfolio_projects', item.id, editItem); setEditId(null); }} disabled={uploading}>
                    <FaSave /> Save
                  </FormButton>
                  <FormButton onClick={() => setEditId(null)}>Cancel</FormButton>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
                {item.image_url && <img src={item.image_url} alt={item.title} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />}
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>{item.title}</h4>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>{item.category}</p>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>{String(item.description).substring(0, 100)}...</p>
                  <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    <FormButton onClick={() => { setEditId(item.id); setEditItem(item); }}>
                      <FaEdit />
                    </FormButton>
                    <FormButton variant="danger" onClick={() => onDelete('portfolio_projects', item.id)}>
                      <FaTrash />
                    </FormButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
