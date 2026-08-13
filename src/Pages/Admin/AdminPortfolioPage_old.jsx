import React, { useState, useEffect } from "react";
import { getSupabaseClient } from "../../lib/supabase";
import { FaSave, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { uploadImage } from "../../lib/imageUpload";
import "./AdminPages.css";
import '../../styles/admin-design-tokens.css';

const TABS = [
  { id: "hero", label: "🎯 Hero" },
  { id: "categories", label: "📁 Categories" },
  { id: "projects", label: "🎨 Projects" },
];

export default function AdminPortfolioPage() {
  const [activeTab, setActiveTab] = useState("hero");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseClient();

  useEffect(() => {
    loadTabData();
  }, [activeTab]);

  const loadTabData = async () => {
    setLoading(true);
    try {
      let result;
      switch (activeTab) {
        case "hero":
          result = await supabase.from("portfolio_page_hero").select("*").single();
          setData({ hero: result.data });
          break;
        case "categories":
          result = await supabase.from("portfolio_categories").select("*").order("sort_order");
          setData({ categories: result.data || [] });
          break;
        case "projects":
          result = await supabase.from("portfolio_projects").select("*").order("sort_order");
          setData({ projects: result.data || [] });
          break;
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (table, formData) => {
    try {
      const result = await supabase.from(table).update(formData).eq("id", formData.id).select();
      if (result.error) throw result.error;
      alert("Saved successfully!");
      loadTabData();
    } catch (error) {
      alert("Error saving: " + error.message);
    }
  };

  const handleAdd = async (table, item) => {
    try {
      const result = await supabase.from(table).insert([item]).select();
      if (result.error) throw result.error;
      alert("Added successfully!");
      loadTabData();
    } catch (error) {
      alert("Error adding: " + error.message);
    }
  };

  const handleDelete = async (table, id) => {
    if (confirm("Delete this item?")) {
      try {
        const result = await supabase.from(table).delete().eq("id", id);
        if (result.error) throw result.error;
        alert("Deleted successfully!");
        loadTabData();
      } catch (error) {
        alert("Error deleting: " + error.message);
      }
    }
  };

  const handleUpdate = async (table, id, updates) => {
    try {
      const result = await supabase.from(table).update(updates).eq("id", id).select();
      if (result.error) throw result.error;
      alert("Updated successfully!");
      loadTabData();
    } catch (error) {
      alert("Error updating: " + error.message);
    }
  };

  const HeroEditor = () => {
    const [form, setForm] = useState(data.hero || {});
    const handleSubmit = async (e) => { e.preventDefault(); await handleSave("portfolio_page_hero", form); };
    return (
      <form onSubmit={handleSubmit} className="editor-form">
        <div className="form-group">
          <label>Page Title</label>
          <input type="text" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Breadcrumb Label</label>
          <input type="text" value={form.breadcrumb_label || ""} onChange={(e) => setForm({ ...form, breadcrumb_label: e.target.value })} />
        </div>
        <button type="submit" className="btn-primary"><FaSave /> Save Hero</button>
      </form>
    );
  };

  const CategoriesEditor = () => {
    const [items, setItems] = useState(data.categories || []);
    const [newItem, setNewItem] = useState({ name: "" });
    const [editId, setEditId] = useState(null);
    const [editItem, setEditItem] = useState({});

    const handleAdd = async () => {
      if (!newItem.name) return alert("Please enter category name");
      await handleAdd("portfolio_categories", newItem);
      setItems([...items, newItem]);
      setNewItem({ name: "" });
    };

    const handleDelete = async (id) => {
      if (confirm("Delete this category?")) {
        await handleDelete("portfolio_categories", id);
        setItems(items.filter((i) => i.id !== id));
      }
    };

    const handleEditStart = (item) => {
      setEditId(item.id);
      setEditItem({ ...item });
    };

    const handleEditSave = async (id) => {
      if (!editItem.name) return alert("Please enter category name");
      await handleUpdate("portfolio_categories", id, editItem);
      setItems(items.map((i) => (i.id === id ? editItem : i)));
      setEditId(null);
    };

    return (
      <div className="editor-section">
        <div className="form-group">
          <h3>Add Category</h3>
          <input placeholder="Category name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
          <button onClick={handleAdd} className="btn-primary"><FaPlus /> Add Category</button>
        </div>

        <div className="data-list">
          {items.map((item) => (
            <div key={item.id} className="data-item">
              {editId === item.id ? (
                <div style={{ width: "100%" }}>
                  <input value={editItem.name} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} />
                  <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                    <button onClick={() => handleEditSave(item.id)} className="btn btn-primary"><FaSave /> Save</button>
                    <button onClick={() => setEditId(null)} className="btn" style={{ background: "#666", color: "white" }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div><p><strong>{item.name}</strong></p></div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => handleEditStart(item)} className="btn" style={{ background: "#2563eb", color: "white" }}><FaEdit /> Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="btn btn-danger"><FaTrash /> Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ProjectsEditor = () => {
    const [items, setItems] = useState(data.projects || []);
    const [newItem, setNewItem] = useState({ title: "", category: "", image_url: "", description: "", results_link: "" });
    const [editId, setEditId] = useState(null);
    const [editItem, setEditItem] = useState({});
    const [uploading, setUploading] = useState(false);

    const categories = data.categories || [];

    const handleImageUpload = async (file, isNew = true) => {
      if (!file) return;
      try {
        setUploading(true);
        const url = await uploadImage(file);
        if (isNew) {
          setNewItem({ ...newItem, image_url: url });
        } else {
          setEditItem({ ...editItem, image_url: url });
        }
      } catch (error) {
        alert("Image upload failed: " + error.message);
      } finally {
        setUploading(false);
      }
    };

    const handleAdd = async () => {
      if (!newItem.title || !newItem.category) return alert("Please fill in required fields");
      await handleAdd("portfolio_projects", newItem);
      setItems([...items, newItem]);
      setNewItem({ title: "", category: "", image_url: "", description: "", results_link: "" });
    };

    const handleDelete = async (id) => {
      if (confirm("Delete this project?")) {
        await handleDelete("portfolio_projects", id);
        setItems(items.filter((i) => i.id !== id));
      }
    };

    const handleEditStart = (item) => {
      setEditId(item.id);
      setEditItem({ ...item });
    };

    const handleEditSave = async (id) => {
      if (!editItem.title || !editItem.category) return alert("Please fill in required fields");
      await handleUpdate("portfolio_projects", id, editItem);
      setItems(items.map((i) => (i.id === id ? editItem : i)));
      setEditId(null);
    };

    return (
      <div className="editor-section">
        <div className="form-group">
          <h3>Add Project</h3>
          <input placeholder="Project title" value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} />
          <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}>
            <option value="">Select Category</option>
            {categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
          </select>
          <textarea placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0], true)} disabled={uploading} />
          {uploading && <span>Uploading...</span>}
          {newItem.image_url && <img src={newItem.image_url} alt="preview" style={{ maxWidth: "150px", maxHeight: "150px", borderRadius: "4px", marginTop: "8px" }} />}
          <button onClick={handleAdd} className="btn-primary" disabled={uploading}><FaPlus /> Add Project</button>
        </div>

        <div className="data-list">
          {items.map((item) => (
            <div key={item.id} className="data-item">
              {editId === item.id ? (
                <div style={{ width: "100%" }}>
                  <input placeholder="Title" value={editItem.title} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })} />
                  <select value={editItem.category} onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}>
                    <option value="">Select Category</option>
                    {categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                  </select>
                  <textarea placeholder="Description" value={editItem.description} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} />
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0], false)} disabled={uploading} />
                  {editItem.image_url && <img src={editItem.image_url} alt="preview" style={{ maxWidth: "150px", maxHeight: "150px", borderRadius: "4px", marginTop: "8px" }} />}
                  <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                    <button onClick={() => handleEditSave(item.id)} className="btn btn-primary" disabled={uploading}><FaSave /> Save</button>
                    <button onClick={() => setEditId(null)} className="btn" style={{ background: "#666", color: "white" }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h4>{item.title}</h4>
                    <p><strong>{item.category}</strong></p>
                    <p>{item.description}</p>
                    {item.image_url && <img src={item.image_url} alt={item.title} style={{ maxWidth: "80px", maxHeight: "80px", borderRadius: "4px", marginTop: "8px" }} />}
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => handleEditStart(item)} className="btn" style={{ background: "#2563eb", color: "white" }}><FaEdit /> Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="btn btn-danger"><FaTrash /> Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="admin-pages">
      <div className="pages-header">
        <h2>🎨 Portfolio Page Manager</h2>
      </div>

      <div className="component-tabs">
        {TABS.map((tab) => (
          <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="component-content">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {activeTab === "hero" && <HeroEditor />}
            {activeTab === "categories" && <CategoriesEditor />}
            {activeTab === "projects" && <ProjectsEditor />}
          </>
        )}
      </div>

      <style>{`
        .admin-pages { padding: 20px; }
        .pages-header { margin-bottom: 20px; }
        .pages-header h2 { margin: 0; }
        .component-tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
        .tab-btn { padding: 8px 12px; border: none; background: #f0f0f0; border-radius: 4px; cursor: pointer; font-weight: 500; }
        .tab-btn.active { background: #252381; color: white; }
        .component-content { background: #f9f9f9; padding: 20px; border-radius: 4px; }
        .editor-form { max-width: 600px; }
        .editor-section { width: 100%; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; font-weight: 500; margin-bottom: 5px; font-size: 14px; }
        .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: inherit; }
        .form-group textarea { min-height: 80px; }
        .data-list { display: grid; gap: 12px; margin-top: 20px; }
        .data-item { background: white; padding: 15px; border-radius: 4px; border: 1px solid #ddd; }
        .data-item h4 { margin: 0 0 5px 0; font-size: 15px; }
        .data-item p { margin: 3px 0; font-size: 13px; }
        .btn { padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-weight: 500; font-size: 13px; }
        .btn-primary { background: #252381; color: white; }
        .btn-danger { background: #dc2626; color: white; }
      `}</style>
    </div>
  );
}
