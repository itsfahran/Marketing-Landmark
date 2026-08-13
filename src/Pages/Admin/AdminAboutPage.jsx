import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '../../lib/supabase';
import { FaSave, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { uploadImage } from '../../lib/imageUpload';
import '../../styles/admin-design-tokens.css';

const TABS = [
  { id: 'hero', label: 'Hero' },
  { id: 'marquee', label: 'Marquee' },
  { id: 'mission', label: 'Mission/Vision' },
  { id: 'team', label: 'Team' },
  { id: 'achievements', label: 'Achievements' },
];

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
  >
    {children}
  </button>
);

export default function AdminAboutPage() {
  const [activeTab, setActiveTab] = useState('hero');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newItem, setNewItem] = useState({});
  const supabase = getSupabaseClient();

  useEffect(() => {
    loadTabData();
  }, [activeTab]);

  const loadTabData = async () => {
    setLoading(true);
    try {
      let result;
      switch (activeTab) {
        case 'hero':
          result = await supabase.from('about_page_hero').select('*').single();
          setData({ hero: result.data });
          break;
        case 'marquee':
          result = await supabase.from('about_page_marquee').select('*').order('sort_order');
          setData({ marquee: result.data || [] });
          break;
        case 'mission':
          result = await supabase.from('about_page_mission_values').select('*').order('sort_order');
          setData({ mission: result.data || [] });
          break;
        case 'team':
          result = await supabase.from('about_page_team').select('*').order('sort_order');
          setData({ team: result.data || [] });
          break;
        case 'achievements':
          result = await supabase.from('about_page_achievements').select('*').order('sort_order');
          setData({ achievements: result.data || [] });
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (table, formData) => {
    try {
      const result = await supabase.from(table).update(formData).eq('id', formData.id).select();
      if (result.error) throw result.error;
      alert('Saved successfully!');
      loadTabData();
    } catch (error) {
      alert('Error saving: ' + error.message);
    }
  };

  const handleAdd = async (table, item) => {
    try {
      const result = await supabase.from(table).insert([item]).select();
      if (result.error) throw result.error;
      alert('Added successfully!');
      loadTabData();
      setNewItem({});
    } catch (error) {
      alert('Error adding: ' + error.message);
    }
  };

  const handleDelete = async (table, id) => {
    if (!confirm('Delete this item?')) return;
    try {
      const result = await supabase.from(table).delete().eq('id', id);
      if (result.error) throw result.error;
      loadTabData();
    } catch (error) {
      alert('Error deleting: ' + error.message);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--text-primary)' }}>About Page</h1>
        <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--text-secondary)', marginTop: 'var(--spacing-sm)' }}>
          Manage about page sections
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', borderBottom: '1px solid var(--border)', marginBottom: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-md)', overflowX: 'auto' }}>
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
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--spacing-2xl)' }}>Loading...</div>
      ) : activeTab === 'hero' && data.hero ? (
        <HeroEditor data={data.hero} onSave={handleSave} />
      ) : activeTab === 'marquee' ? (
        <ListEditor title="Marquee Item" items={data.marquee || []} table="about_page_marquee" onAdd={handleAdd} onDelete={handleDelete} onUpdate={handleSave} />
      ) : activeTab === 'mission' ? (
        <ListEditor title="Mission/Vision" items={data.mission || []} table="about_page_mission_values" onAdd={handleAdd} onDelete={handleDelete} onUpdate={handleSave} />
      ) : activeTab === 'team' ? (
        <TeamEditor items={data.team || []} table="about_page_team" onAdd={handleAdd} onDelete={handleDelete} onUpdate={handleSave} />
      ) : activeTab === 'achievements' ? (
        <ListEditor title="Achievement" items={data.achievements || []} table="about_page_achievements" onAdd={handleAdd} onDelete={handleDelete} onUpdate={handleSave} />
      ) : (
        <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 'var(--spacing-2xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
          No data available
        </div>
      )}
    </div>
  );
}

// Hero Editor
const HeroEditor = ({ data, onSave }) => {
  const [form, setForm] = useState(data || {});

  return (
    <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 'var(--spacing-lg)' }}>
      <FormInput label="Heading" value={form.heading || ''} onChange={(e) => setForm({ ...form, heading: e.target.value })} placeholder="Hero heading" />
      <FormTextarea label="Subheading" value={form.subheading || ''} onChange={(e) => setForm({ ...form, subheading: e.target.value })} placeholder="Hero subheading" />
      <FormTextarea label="Description" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Hero description" />
      <FormButton onClick={() => onSave('about_page_hero', form)}>
        <FaSave /> Save Hero
      </FormButton>
    </div>
  );
};

// List Editor
const ListEditor = ({ title, items, table, onAdd, onDelete, onUpdate }) => {
  const [newItem, setNewItem] = useState({});
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  return (
    <div>
      {/* Add Section */}
      <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-lg)' }}>Add {title}</h3>
        <FormInput label="Title" value={newItem.title || ''} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} placeholder="Title" />
        <FormTextarea label="Description" value={newItem.description || ''} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} placeholder="Description" />
        <FormButton onClick={() => onAdd(table, { ...newItem, sort_order: (items?.length || 0) + 1 })}>
          <FaPlus /> Add {title}
        </FormButton>
      </div>

      {/* Items List */}
      {items && items.length > 0 ? (
        <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
          {items.map((item) => (
            <div key={item.id} style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 'var(--spacing-lg)' }}>
              {editId === item.id ? (
                <div>
                  <FormInput label="Title" value={editData.title || ''} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
                  <FormTextarea label="Description" value={editData.description || ''} onChange={(e) => setEditData({ ...editData, description: e.target.value })} />
                  <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    <FormButton onClick={() => { onUpdate(table, item.id, editData); setEditId(null); }}>
                      <FaSave /> Save
                    </FormButton>
                    <FormButton onClick={() => setEditId(null)}>Cancel</FormButton>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>{item.title}</h4>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{String(item.description).substring(0, 100)}...</p>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    <FormButton onClick={() => { setEditId(item.id); setEditData(item); }}>
                      <FaEdit />
                    </FormButton>
                    <FormButton variant="danger" onClick={() => onDelete(table, item.id)}>
                      <FaTrash />
                    </FormButton>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)', padding: 'var(--spacing-2xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
          No {title.toLowerCase()} yet
        </div>
      )}
    </div>
  );
};

// Team Editor
const TeamEditor = ({ items, table, onAdd, onDelete, onUpdate }) => {
  const [newItem, setNewItem] = useState({});
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file, isNew) => {
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadImage(file);
      if (isNew) {
        setNewItem({ ...newItem, image_url: url });
      } else {
        setEditData({ ...editData, image_url: url });
      }
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {/* Add Section */}
      <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-lg)' }}>Add Team Member</h3>
        <FormInput label="Name" value={newItem.name || ''} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
        <FormInput label="Role" value={newItem.role || ''} onChange={(e) => setNewItem({ ...newItem, role: e.target.value })} />
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>Image</label>
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0], true)} disabled={uploading} />
          {uploading && <p style={{ marginTop: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>Uploading...</p>}
          {newItem.image_url && <img src={newItem.image_url} alt="preview" style={{ maxWidth: '150px', marginTop: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }} />}
        </div>
        <FormButton onClick={() => onAdd(table, { ...newItem, sort_order: (items?.length || 0) + 1 })} disabled={uploading}>
          <FaPlus /> Add Member
        </FormButton>
      </div>

      {/* Items List */}
      {items && items.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>
          {items.map((item) => (
            <div key={item.id} style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 'var(--spacing-lg)', textAlign: 'center' }}>
              {item.image_url && <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-md)' }} />}
              <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>{item.name}</h4>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>{item.role}</p>
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'center' }}>
                <FormButton onClick={() => { setEditId(item.id); setEditData(item); }}>
                  <FaEdit />
                </FormButton>
                <FormButton variant="danger" onClick={() => onDelete(table, item.id)}>
                  <FaTrash />
                </FormButton>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)', padding: 'var(--spacing-2xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
          No team members yet
        </div>
      )}

      {/* Edit Modal */}
      {editId && (
        <div style={{ marginTop: 'var(--spacing-xl)', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 'var(--spacing-lg)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Edit Team Member</h3>
          <FormInput label="Name" value={editData.name || ''} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
          <FormInput label="Role" value={editData.role || ''} onChange={(e) => setEditData({ ...editData, role: e.target.value })} />
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>Image</label>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0], false)} disabled={uploading} />
            {editData.image_url && <img src={editData.image_url} alt="preview" style={{ maxWidth: '150px', marginTop: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }} />}
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <FormButton onClick={() => { onUpdate(table, editId, editData); setEditId(null); }} disabled={uploading}>
              <FaSave /> Save
            </FormButton>
            <FormButton onClick={() => setEditId(null)}>Cancel</FormButton>
          </div>
        </div>
      )}
    </div>
  );
};
