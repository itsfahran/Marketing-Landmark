/**
 * Admin Blog Manager
 * Create, read, update, delete blog posts
 * Connected to Supabase
 */

import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { fetchBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '../../lib/supabase-queries';
import './AdminModule.css';

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'SEO',
    status: 'draft',
    content: '',
    excerpt: '',
    author_name: 'Admin',
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await fetchBlogPosts(''); // Empty string = fetch all, not just published
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingId) {
        const updated = await updateBlogPost(editingId, {
          ...formData,
          published_at: formData.status === 'published' ? new Date().toISOString() : null,
        });
        if (updated) {
          setPosts(posts.map((p) => (p.id === editingId ? updated : p)));
          alert('Post updated successfully!');
        }
      } else {
        const newPost = await createBlogPost({
          ...formData,
          published_at: formData.status === 'published' ? new Date().toISOString() : null,
        });
        if (newPost) {
          setPosts([...posts, newPost]);
          alert('Post created successfully!');
        }
      }
      resetForm();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post) => {
    setFormData(post);
    setEditingId(post.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this post?')) {
      try {
        const success = await deleteBlogPost(id);
        if (success) {
          setPosts(posts.filter((p) => p.id !== id));
          alert('Post deleted!');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ title: '', slug: '', category: 'SEO', status: 'draft', content: '', excerpt: '', author_name: 'Admin' });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <p style={{ padding: '40px', textAlign: 'center' }}>Loading posts...</p>;
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-module">
      <div className="module-header">
        <h2>Manage Blog Posts</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <FaPlus /> New Post
        </button>
      </div>

      <div className="module-search">
        <FaSearch />
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredPosts.length > 0 ? (
        <div className="module-table">
          <div className="table-header">
            <div>Title</div>
            <div>Category</div>
            <div>Status</div>
            <div>Date</div>
            <div>Actions</div>
          </div>
          {filteredPosts.map((post) => (
            <div key={post.id} className="table-row">
              <div>
                <strong>{post.title}</strong>
              </div>
              <div>{post.category}</div>
              <div>
                <span className={`status ${post.status}`}>{post.status}</span>
              </div>
              <div>{post.publishedAt}</div>
              <div className="actions">
                <button onClick={() => handleEdit(post)} className="action-btn edit">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(post.id)} className="action-btn delete">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-data">No blog posts found</p>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? 'Edit Post' : 'New Blog Post'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Slug *</label>
                <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange}>
                  <option>SEO</option>
                  <option>GEO</option>
                  <option>Local SEO</option>
                  <option>Web Dev</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea name="content" value={formData.content} onChange={handleInputChange} rows="8" />
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
