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
  { id: 'video_testimonials', label: 'Video Testimonials' },
  { id: 'brands', label: 'Brands' },
  { id: 'choose', label: 'Why Choose' },
  { id: 'contact', label: 'Contact' },
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

// CRUD List Editor
const CRUDEditor = ({ title, items, table, fields, onAdd, onDelete, onUpdate, onImageUpload }) => {
  const [newItem, setNewItem] = useState(fields.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {}));
  const [editId, setEditId] = useState(null);
  const [editItem, setEditItem] = useState({});
  const [uploading, setUploading] = useState(false);

  return (
    <div>
      {/* Add Section */}
      <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-lg)' }}>Add {title}</h3>
        {fields.map((field) => {
          if (field.type === 'image') {
            return (
              <div key={field.key} style={{ marginBottom: 'var(--spacing-lg)' }}>
                <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>
                  {field.label}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      onImageUpload(e.target.files[0], field.key, true, newItem, setNewItem);
                    }
                  }}
                  style={{ display: 'block', width: '100%' }}
                />
                {newItem[field.key] && (
                  <img src={newItem[field.key]} alt="preview" style={{ maxWidth: '100px', marginTop: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }} />
                )}
              </div>
            );
          } else if (field.type === 'textarea') {
            return (
              <FormTextarea
                key={field.key}
                label={field.label}
                value={newItem[field.key]}
                onChange={(e) => setNewItem({ ...newItem, [field.key]: e.target.value })}
                placeholder={field.label}
              />
            );
          } else {
            return (
              <FormInput
                key={field.key}
                label={field.label}
                value={newItem[field.key]}
                onChange={(e) => setNewItem({ ...newItem, [field.key]: e.target.value })}
                placeholder={field.label}
              />
            );
          }
        })}
        <FormButton onClick={() => { onAdd(table, newItem); setNewItem(fields.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {})); }} disabled={uploading}>
          <FaPlus /> Add {title}
        </FormButton>
      </div>

      {/* Items List */}
      <div>
        {items && items.length > 0 ? (
          <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
            {items.map((item) => (
              <div key={item.id} style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 'var(--spacing-lg)' }}>
                {editId === item.id ? (
                  <div>
                    {fields.map((field) => {
                      if (field.type === 'image') {
                        return (
                          <div key={field.key} style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>
                              {field.label}
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  onImageUpload(e.target.files[0], field.key, false, editItem, setEditItem);
                                }
                              }}
                              style={{ display: 'block', width: '100%' }}
                            />
                            {editItem[field.key] && (
                              <img src={editItem[field.key]} alt="preview" style={{ maxWidth: '100px', marginTop: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }} />
                            )}
                          </div>
                        );
                      } else if (field.type === 'textarea') {
                        return (
                          <FormTextarea
                            key={field.key}
                            label={field.label}
                            value={editItem[field.key]}
                            onChange={(e) => setEditItem({ ...editItem, [field.key]: e.target.value })}
                          />
                        );
                      } else {
                        return (
                          <FormInput
                            key={field.key}
                            label={field.label}
                            value={editItem[field.key]}
                            onChange={(e) => setEditItem({ ...editItem, [field.key]: e.target.value })}
                          />
                        );
                      }
                    })}
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                      <FormButton onClick={() => { onUpdate(table, item.id, editItem); setEditId(null); }} disabled={uploading}>
                        <FaSave /> Save
                      </FormButton>
                      <FormButton onClick={() => setEditId(null)}>Cancel</FormButton>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>
                        {item[fields[0].key]}
                      </h4>
                      {fields.slice(1, 3).map((field) => (
                        <p key={field.key} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
                          {item[field.key] ? String(item[field.key]).substring(0, 50) : '—'}
                        </p>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                      <FormButton onClick={() => { setEditId(item.id); setEditItem(item); }}>
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
      const queries = {
        hero: () => supabase.from('hero').select('*').single(),
        services: () => supabase.from('services').select('*').order('sort_order'),
        process_steps: () => supabase.from('process_steps').select('*').order('sort_order'),
        about: () => supabase.from('about').select('*').single(),
        hire_gigs: () => supabase.from('hire_gigs').select('*').order('sort_order'),
        portfolio_items: () => supabase.from('portfolio_items').select('*').order('sort_order'),
        testimonials: () => supabase.from('testimonials').select('*').order('sort_order'),
        video_testimonials: () => supabase.from('video_testimonials').select('*').order('sort_order'),
        brands: () => supabase.from('brands').select('*').order('sort_order'),
        choose_features: () => supabase.from('choose_features').select('*').order('sort_order'),
        contact: () => supabase.from('contact').select('*').single(),
      };

      const data = {};
      for (const [key, query] of Object.entries(queries)) {
        const result = await query();
        data[key] = result.data;
      }
      setAllData(data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file, fieldKey, isNew, currentData, setter) => {
    try {
      const url = await uploadImage(file);
      setter({ ...currentData, [fieldKey]: url });
    } catch (error) {
      alert('Upload failed: ' + error.message);
    }
  };

  const handleSave = async (table, data) => {
    try {
      const { error } = await supabase.from(table).upsert([data]);
      if (error) throw error;
      loadAllData();
      alert('Saved!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleAdd = async (table, data) => {
    try {
      const { error } = await supabase.from(table).insert([data]);
      if (error) throw error;
      loadAllData();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleDelete = async (table, id) => {
    if (!confirm('Delete?')) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      loadAllData();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleUpdate = async (table, id, data) => {
    try {
      const { error } = await supabase.from(table).update(data).eq('id', id);
      if (error) throw error;
      loadAllData();
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
        <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--text-primary)' }}>Home Components</h1>
        <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--text-secondary)', marginTop: 'var(--spacing-sm)' }}>
          Manage all sections of your home page
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
      <div>
        {activeTab === 'hero' && allData.hero && (
          <HeroEditor data={allData.hero} onSave={(data) => handleSave('hero', data)} />
        )}

        {activeTab === 'services' && (
          <CRUDEditor
            title="Service"
            items={allData.services}
            table="services"
            fields={[{ key: 'name', label: 'Name' }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'icon_name', label: 'Icon' }]}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onImageUpload={handleImageUpload}
          />
        )}

        {activeTab === 'process' && (
          <CRUDEditor
            title="Step"
            items={allData.process_steps}
            table="process_steps"
            fields={[{ key: 'title', label: 'Title' }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'icon_name', label: 'Icon' }]}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onImageUpload={handleImageUpload}
          />
        )}

        {activeTab === 'about' && allData.about && (
          <HeroEditor data={allData.about} onSave={(data) => handleSave('about', data)} />
        )}

        {activeTab === 'hire' && (
          <CRUDEditor
            title="Gig"
            items={allData.hire_gigs}
            table="hire_gigs"
            fields={[{ key: 'title', label: 'Title' }, { key: 'rating', label: 'Rating' }, { key: 'review_count', label: 'Reviews' }, { key: 'price_label', label: 'Price' }, { key: 'image_url', label: 'Image', type: 'image' }]}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onImageUpload={handleImageUpload}
          />
        )}

        {activeTab === 'portfolio' && (
          <CRUDEditor
            title="Item"
            items={allData.portfolio_items}
            table="portfolio_items"
            fields={[{ key: 'title', label: 'Title' }, { key: 'category', label: 'Category' }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'image_url', label: 'Image', type: 'image' }]}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onImageUpload={handleImageUpload}
          />
        )}

        {activeTab === 'testimonials' && (
          <CRUDEditor
            title="Testimonial"
            items={allData.testimonials}
            table="testimonials"
            fields={[{ key: 'client_name', label: 'Name' }, { key: 'client_title', label: 'Title' }, { key: 'testimonial_text', label: 'Testimonial', type: 'textarea' }, { key: 'rating', label: 'Rating' }, { key: 'client_image', label: 'Image', type: 'image' }]}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onImageUpload={handleImageUpload}
          />
        )}

        {activeTab === 'video_testimonials' && (
          <CRUDEditor
            title="Video Testimonial"
            items={allData.video_testimonials}
            table="video_testimonials"
            fields={[{ key: 'title', label: 'Title' }, { key: 'subtitle', label: 'Subtitle' }, { key: 'video_url', label: 'YouTube URL' }, { key: 'caption', label: 'Caption', type: 'textarea' }, { key: 'profile_image_url', label: 'Profile Image', type: 'image' }, { key: 'link', label: 'Link' }]}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onImageUpload={handleImageUpload}
          />
        )}

        {activeTab === 'brands' && (
          <CRUDEditor
            title="Brand"
            items={allData.brands}
            table="brands"
            fields={[{ key: 'name', label: 'Name' }, { key: 'website_url', label: 'Website' }, { key: 'logo_url', label: 'Logo', type: 'image' }]}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onImageUpload={handleImageUpload}
          />
        )}

        {activeTab === 'choose' && (
          <CRUDEditor
            title="Feature"
            items={allData.choose_features}
            table="choose_features"
            fields={[{ key: 'title', label: 'Title' }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'icon_name', label: 'Icon' }]}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onImageUpload={handleImageUpload}
          />
        )}

        {activeTab === 'contact' && allData.contact && (
          <HeroEditor data={allData.contact} onSave={(data) => handleSave('contact', data)} />
        )}
      </div>
    </div>
  );
}

// Hero Editor
const HeroEditor = ({ data, onSave }) => {
  const [form, setForm] = useState(data || {});

  return (
    <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 'var(--spacing-lg)' }}>
      <FormInput label="Heading" value={form.heading || ''} onChange={(e) => setForm({ ...form, heading: e.target.value })} />
      <FormInput label="Subheading" value={form.subheading || ''} onChange={(e) => setForm({ ...form, subheading: e.target.value })} />
      <FormTextarea label="Description" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <FormButton onClick={() => onSave(form)}>
        <FaSave /> Save
      </FormButton>
    </div>
  );
};
