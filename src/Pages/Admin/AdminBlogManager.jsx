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

const FormSelect = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom: 'var(--spacing-lg)' }}>
    <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--spacing-sm)' }}>
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        padding: 'var(--spacing-md)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-primary)',
        backgroundColor: 'var(--surface)',
      }}
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
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

export default function AdminBlogManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [categories, setCategories] = useState([]);
  const supabase = getSupabaseClient();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      setPosts(data || []);

      // Extract categories
      const cats = data?.map((p) => p.category).filter((v, i, a) => a.indexOf(v) === i) || [];
      setCategories(cats);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (postData) => {
    try {
      const { error } = await supabase.from('blog_posts').insert([postData]);
      if (error) throw error;
      loadPosts();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      loadPosts();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      const { error } = await supabase.from('blog_posts').update(data).eq('id', id);
      if (error) throw error;
      loadPosts();
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
        <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--text-primary)' }}>Blog Manager</h1>
        <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--text-secondary)', marginTop: 'var(--spacing-sm)' }}>
          Manage your blog posts
        </p>
      </div>

      {/* Add Post Section */}
      <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-lg)' }}>Create New Post</h3>
        <NewPostForm onSave={handleAdd} categories={categories} />
      </div>

      {/* Posts List */}
      <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onEdit={(data) => handleUpdate(post.id, data)} onDelete={() => handleDelete(post.id)} categories={categories} />
          ))
        ) : (
          <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)', padding: 'var(--spacing-2xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
            No blog posts yet
          </div>
        )}
      </div>
    </div>
  );
}

const NewPostForm = ({ onSave, categories }) => {
  const [form, setForm] = useState({ title: '', slug: '', category: '', description: '', content: '', status: 'draft', featured_image_url: '' });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file) => {
    try {
      setUploading(true);
      const url = await uploadImage(file);
      setForm({ ...form, featured_image_url: url });
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!form.title || !form.slug || !form.category) {
      alert('Please fill in title, slug, and category');
      return;
    }
    onSave(form);
    setForm({ title: '', slug: '', category: '', description: '', content: '', status: 'draft', featured_image_url: '' });
  };

  return (
    <div>
      <FormInput label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Post title" />
      <FormInput label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="post-url-slug" />
      <FormInput label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" />
      <FormTextarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description" />
      <FormTextarea label="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Full post content" />
      <FormSelect label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={['draft', 'published']} />
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>Featured Image</label>
        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0])} disabled={uploading} />
        {form.featured_image_url && <img src={form.featured_image_url} alt="preview" style={{ maxWidth: '150px', marginTop: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }} />}
      </div>
      <FormButton onClick={handleSubmit} disabled={uploading}>
        <FaPlus /> Create Post
      </FormButton>
    </div>
  );
};

const PostCard = ({ post, onEdit, onDelete, categories }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(post);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file) => {
    try {
      setUploading(true);
      const url = await uploadImage(file);
      setForm({ ...form, featured_image_url: url });
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (editing) {
    return (
      <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 'var(--spacing-lg)' }}>
        <FormInput label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <FormInput label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <FormInput label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <FormTextarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <FormTextarea label="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        <FormSelect label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={['draft', 'published']} />
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>Featured Image</label>
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0])} disabled={uploading} />
          {form.featured_image_url && <img src={form.featured_image_url} alt="preview" style={{ maxWidth: '150px', marginTop: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }} />}
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <FormButton onClick={() => { onEdit(form); setEditing(false); }} disabled={uploading}>
            <FaSave /> Save
          </FormButton>
          <FormButton onClick={() => setEditing(false)}>Cancel</FormButton>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 'var(--spacing-lg)' }}>
      <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
        {post.featured_image_url && <img src={post.featured_image_url} alt={post.title} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />}
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>{post.title}</h4>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xs)' }}>Category: {post.category}</p>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>Status: {post.status}</p>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>{String(post.description).substring(0, 100)}...</p>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <FormButton onClick={() => setEditing(true)}>
              <FaEdit /> Edit
            </FormButton>
            <FormButton variant="danger" onClick={onDelete}>
              <FaTrash /> Delete
            </FormButton>
          </div>
        </div>
      </div>
    </div>
  );
};
