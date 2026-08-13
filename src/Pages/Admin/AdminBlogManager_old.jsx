import React, { useState, useEffect } from "react";
import { getSupabaseClient } from "../../lib/supabase";
import { FaSave, FaPlus, FaTrash, FaEdit, FaEye } from "react-icons/fa";
import { uploadImage } from "../../lib/imageUpload";
import "./AdminPages.css";
import '../../styles/admin-design-tokens.css';

export default function AdminBlogManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const supabase = getSupabaseClient();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "SEO",
    description: "",
    content: "",
    featured_image_url: "",
    status: "draft",
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadImage(file);
      setFormData({ ...formData, featured_image_url: url });
    } catch (error) {
      alert("Image upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) {
      alert("Please fill in title and slug");
      return;
    }

    try {
      if (editingId) {
        await supabase
          .from("blog_posts")
          .update(formData)
          .eq("id", editingId);
      } else {
        await supabase.from("blog_posts").insert([formData]);
      }
      loadPosts();
      setFormData({
        title: "",
        slug: "",
        category: "SEO",
        description: "",
        content: "",
        featured_image_url: "",
        status: "draft",
      });
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      alert("Error saving post: " + error.message);
    }
  };

  const handleEdit = (post) => {
    setFormData(post);
    setEditingId(post.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this post?")) {
      try {
        await supabase.from("blog_posts").delete().eq("id", id);
        loadPosts();
      } catch (error) {
        alert("Error deleting post: " + error.message);
      }
    }
  };

  return (
    <div className="admin-pages">
      <div className="pages-header">
        <h2>📝 Blog Manager</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            if (showForm) {
              setFormData({
                title: "",
                slug: "",
                category: "SEO",
                description: "",
                content: "",
                featured_image_url: "",
                status: "draft",
              });
            }
          }}
          style={{
            background: "#252381",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FaPlus /> New Post
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "4px", marginBottom: "20px" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div>
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Blog title"
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                />
              </div>
              <div>
                <label>Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="blog-post-slug"
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                />
              </div>
              <div>
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                >
                  <option>SEO</option>
                  <option>GEO</option>
                  <option>Local SEO</option>
                  <option>Content</option>
                  <option>Web Development</option>
                </select>
              </div>
              <div>
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: "15px" }}>
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Short description (shown in blog list)"
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd", minHeight: "80px" }}
              />
            </div>

            <div style={{ marginTop: "15px" }}>
              <label>Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Full blog content"
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd", minHeight: "200px" }}
              />
            </div>

            <div style={{ marginTop: "15px" }}>
              <label>Featured Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files?.[0])}
                disabled={uploading}
                style={{ marginBottom: "10px" }}
              />
              {uploading && <span>Uploading...</span>}
              {formData.featured_image_url && (
                <img
                  src={formData.featured_image_url}
                  alt="preview"
                  style={{ maxWidth: "200px", maxHeight: "200px", borderRadius: "4px", marginTop: "10px" }}
                />
              )}
            </div>

            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button
                type="submit"
                disabled={uploading}
                style={{
                  background: "#252381",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaSave /> {editingId ? "Update" : "Create"} Post
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    title: "",
                    slug: "",
                    category: "SEO",
                    description: "",
                    content: "",
                    featured_image_url: "",
                    status: "draft",
                  });
                }}
                style={{
                  background: "#666",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {posts.map((post) => (
            <div
              key={post.id}
              style={{
                background: "white",
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "15px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: "0 0 5px" }}>{post.title}</h4>
                <p style={{ margin: "0", fontSize: "13px", color: "#666" }}>
                  <strong>{post.category}</strong> • {post.slug}
                </p>
                <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#999" }}>
                  Status: <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>{post.status}</span>
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => handleEdit(post)}
                  style={{
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  style={{
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
