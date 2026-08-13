import React, { useState, useEffect } from "react";
import { getSupabaseClient } from "../../lib/supabase";
import { FaSave, FaPlus, FaTrash, FaEdit, FaImage } from "react-icons/fa";
import { uploadImage } from "../../lib/imageUpload";
import "./AdminPages.css";

const TABS = [
  { id: "hero", label: "🎯 Hero" },
  { id: "services", label: "💼 Services" },
  { id: "process", label: "⚙️ Process" },
  { id: "about", label: "👤 About" },
  { id: "hire", label: "💰 Hire Me" },
  { id: "portfolio", label: "🎨 Portfolio" },
  { id: "testimonials", label: "⭐ Testimonials" },
  { id: "brands", label: "🏢 Brands" },
  { id: "choose", label: "💎 Why Choose" },
  { id: "contact", label: "📞 Contact" },
];

const HeroEditor = ({ data, onSave }) => {
  const [form, setForm] = useState(data || {});
  const handleSubmit = async (e) => { e.preventDefault(); await onSave("hero", form); };
  return (
    <form onSubmit={handleSubmit} className="editor-form">
      <div className="form-group">
        <label>Heading</label>
        <input type="text" value={form.heading || ""} onChange={(e) => setForm({ ...form, heading: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div className="form-group">
        <label>CTA Text</label>
        <input type="text" value={form.cta_text || ""} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} />
      </div>
      <div className="form-group">
        <label>CTA Link</label>
        <input type="text" value={form.cta_link || ""} onChange={(e) => setForm({ ...form, cta_link: e.target.value })} />
      </div>
      <button type="submit" className="btn-primary"><FaSave /> Save Hero</button>
    </form>
  );
};

const ListEditor = ({ title, data, fields, tableName, onAdd, onDelete, onUpdate }) => {
  const [items, setItems] = useState(data || []);
  const [newItem, setNewItem] = useState(fields.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {}));
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
      alert("Image upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async () => {
    if (!newItem[fields[0].key]) return alert(`Please enter ${fields[0].key}`);
    await onAdd(tableName, newItem);
    setItems([...items, newItem]);
    setNewItem(fields.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {}));
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this item?")) {
      await onDelete(tableName, id);
      setItems(items.filter((i) => i.id !== id));
    }
  };

  const handleEditStart = (item) => {
    setEditId(item.id);
    setEditItem({ ...item });
  };

  const handleEditSave = async (id) => {
    if (!editItem[fields[0].key]) return alert(`Please enter ${fields[0].key}`);
    await onUpdate(tableName, id, editItem);
    setItems(items.map((i) => (i.id === id ? editItem : i)));
    setEditId(null);
  };

  const renderField = (field, isNew = true) => {
    const value = isNew ? newItem[field.key] : editItem[field.key];
    const setter = isNew ? setNewItem : setEditItem;

    if (field.type === "image") {
      return (
        <div key={field.key} style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", fontWeight: "500", marginBottom: "8px" }}>{field.label}</label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files?.[0], field.key, isNew)}
              disabled={uploading}
              style={{ flex: 1 }}
            />
            {uploading && <span>Uploading...</span>}
          </div>
          {value && (
            <div style={{ marginTop: "8px" }}>
              <img src={value} alt="preview" style={{ maxWidth: "150px", maxHeight: "150px", borderRadius: "4px" }} />
            </div>
          )}
        </div>
      );
    } else if (field.type === "textarea") {
      return (
        <textarea
          key={field.key}
          placeholder={field.label}
          value={value}
          onChange={(e) => setter({ ...value === newItem[field.key] ? newItem : editItem, [field.key]: e.target.value })}
        />
      );
    } else if (field.type === "number") {
      return (
        <input
          key={field.key}
          type="number"
          placeholder={field.label}
          value={value}
          onChange={(e) => setter({ ...value === newItem[field.key] ? newItem : editItem, [field.key]: isNaN(e.target.value) ? "" : e.target.value })}
        />
      );
    } else if (field.type === "select") {
      return (
        <select
          key={field.key}
          value={value}
          onChange={(e) => setter({ ...value === newItem[field.key] ? newItem : editItem, [field.key]: e.target.value })}
        >
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    } else {
      return (
        <input
          key={field.key}
          type="text"
          placeholder={field.label}
          value={value}
          onChange={(e) => setter({ ...value === newItem[field.key] ? newItem : editItem, [field.key]: e.target.value })}
        />
      );
    }
  };

  return (
    <div className="editor-section">
      <div className="form-group">
        <h3>Add New {title}</h3>
        {fields.map((field) => renderField(field, true))}
        <button onClick={handleAdd} className="btn-primary" disabled={uploading}>
          <FaPlus /> Add {title}
        </button>
      </div>

      <div className="data-list">
        {items.map((item) => (
          <div key={item.id} className="data-item">
            {editId === item.id ? (
              <div style={{ width: "100%" }}>
                {fields.map((field) => renderField(field, false))}
                <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                  <button onClick={() => handleEditSave(item.id)} className="btn btn-primary" disabled={uploading}>
                    <FaSave /> Save
                  </button>
                  <button onClick={() => setEditId(null)} className="btn" style={{ background: "#666", color: "white" }}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h4>{item[fields[0].key]}</h4>
                  {fields.slice(1).map((field) => {
                    if (field.type === "image" && item[field.key]) {
                      return (
                        <div key={field.key} style={{ marginTop: "8px" }}>
                          <img src={item[field.key]} alt={field.label} style={{ maxWidth: "100px", maxHeight: "100px", borderRadius: "4px" }} />
                        </div>
                      );
                    }
                    return (
                      <p key={field.key} style={{ fontSize: "13px", color: "#666" }}>
                        {item[field.key]}
                      </p>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => handleEditStart(item)} className="btn" style={{ background: "#2563eb", color: "white" }}>
                    <FaEdit /> Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="btn btn-danger">
                    <FaTrash /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const AboutEditor = ({ data, onSave }) => {
  const [form, setForm] = useState(data || {});
  const handleSubmit = async (e) => { e.preventDefault(); await onSave("about", form); };
  return (
    <form onSubmit={handleSubmit} className="editor-form">
      <div className="form-group">
        <label>Heading</label>
        <input type="text" value={form.heading || ""} onChange={(e) => setForm({ ...form, heading: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Years Experience</label>
        <input type="number" value={form.years_experience || 0} onChange={(e) => setForm({ ...form, years_experience: parseInt(e.target.value) })} />
      </div>
      <div className="form-group">
        <label>Total Projects</label>
        <input type="number" value={form.total_projects || 0} onChange={(e) => setForm({ ...form, total_projects: parseInt(e.target.value) })} />
      </div>
      <div className="form-group">
        <label>Satisfaction Rate (%)</label>
        <input type="number" value={form.satisfaction_rate || 0} onChange={(e) => setForm({ ...form, satisfaction_rate: parseInt(e.target.value) })} />
      </div>
      <button type="submit" className="btn-primary"><FaSave /> Save About</button>
    </form>
  );
};

const ContactEditor = ({ data, onSave }) => {
  const [form, setForm] = useState(data || {});
  const handleSubmit = async (e) => { e.preventDefault(); await onSave("contact", form); };
  return (
    <form onSubmit={handleSubmit} className="editor-form">
      <div className="form-group">
        <label>Heading</label>
        <input type="text" value={form.heading || ""} onChange={(e) => setForm({ ...form, heading: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Phone</label>
        <input type="text" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Address</label>
        <input type="text" value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      </div>
      <button type="submit" className="btn-primary"><FaSave /> Save Contact</button>
    </form>
  );
};

export default function AdminHomeComponents() {
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
          result = await supabase.from("hero").select("*").single();
          setData({ hero: result.data });
          break;
        case "services":
          result = await supabase.from("services").select("*").order("sort_order");
          setData({ services: result.data || [] });
          break;
        case "process":
          result = await supabase.from("process_steps").select("*").order("sort_order");
          setData({ process: result.data || [] });
          break;
        case "about":
          result = await supabase.from("about").select("*").single();
          setData({ about: result.data });
          break;
        case "hire":
          result = await supabase.from("hire_gigs").select("*").order("sort_order");
          setData({ hire: result.data || [] });
          break;
        case "portfolio":
          result = await supabase.from("portfolio_items").select("*").order("sort_order");
          setData({ portfolio: result.data || [] });
          break;
        case "testimonials":
          result = await supabase.from("testimonials").select("*").order("sort_order");
          setData({ testimonials: result.data || [] });
          break;
        case "brands":
          result = await supabase.from("brands").select("*").order("sort_order");
          setData({ brands: result.data || [] });
          break;
        case "choose":
          result = await supabase.from("choose_features").select("*").order("sort_order");
          setData({ choose: result.data || [] });
          break;
        case "contact":
          result = await supabase.from("contact").select("*").single();
          setData({ contact: result.data });
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
    try {
      const result = await supabase.from(table).delete().eq("id", id);
      if (result.error) throw result.error;
      alert("Deleted successfully!");
      loadTabData();
    } catch (error) {
      alert("Error deleting: " + error.message);
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

  return (
    <div className="admin-pages">
      <div className="pages-header">
        <h2>🏠 Home Page Components Manager</h2>
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
            {activeTab === "hero" && <HeroEditor data={data.hero} onSave={handleSave} />}
            {activeTab === "services" && <ListEditor title="Service" data={data.services} fields={[{ key: "name", label: "Service name", type: "text" }, { key: "description", label: "Description", type: "textarea" }, { key: "icon_name", label: "Icon name", type: "text" }]} tableName="services" onAdd={handleAdd} onDelete={handleDelete} onUpdate={handleUpdate} />}
            {activeTab === "process" && <ListEditor title="Step" data={data.process} fields={[{ key: "title", label: "Step title", type: "text" }, { key: "description", label: "Description", type: "textarea" }, { key: "icon_name", label: "Icon name", type: "text" }]} tableName="process_steps" onAdd={handleAdd} onDelete={handleDelete} onUpdate={handleUpdate} />}
            {activeTab === "about" && <AboutEditor data={data.about} onSave={handleSave} />}
            {activeTab === "hire" && <ListEditor title="Gig" data={data.hire} fields={[{ key: "title", label: "Gig title", type: "text" }, { key: "price", label: "Price", type: "text" }, { key: "rating", label: "Rating", type: "number" }, { key: "reviews", label: "Reviews", type: "number" }, { key: "image_url", label: "Gig Image", type: "image" }]} tableName="hire_gigs" onAdd={handleAdd} onDelete={handleDelete} onUpdate={handleUpdate} />}
            {activeTab === "portfolio" && <ListEditor title="Project" data={data.portfolio} fields={[{ key: "title", label: "Project title", type: "text" }, { key: "description", label: "Description", type: "textarea" }, { key: "image_url", label: "Project Image", type: "image" }]} tableName="portfolio_items" onAdd={handleAdd} onDelete={handleDelete} onUpdate={handleUpdate} />}
            {activeTab === "testimonials" && <ListEditor title="Testimonial" data={data.testimonials} fields={[{ key: "client_name", label: "Client name", type: "text" }, { key: "client_title", label: "Client title", type: "text" }, { key: "testimonial_text", label: "Testimonial", type: "textarea" }, { key: "rating", label: "Rating", type: "number" }, { key: "client_avatar_url", label: "Client Avatar", type: "image" }]} tableName="testimonials" onAdd={handleAdd} onDelete={handleDelete} onUpdate={handleUpdate} />}
            {activeTab === "brands" && <ListEditor title="Brand" data={data.brands} fields={[{ key: "name", label: "Brand name", type: "text" }, { key: "logo_url", label: "Brand Logo", type: "image" }, { key: "row_group", label: "Row", type: "select", options: ["top", "bottom"] }]} tableName="brands" onAdd={handleAdd} onDelete={handleDelete} onUpdate={handleUpdate} />}
            {activeTab === "choose" && <ListEditor title="Feature" data={data.choose} fields={[{ key: "title", label: "Feature title", type: "text" }, { key: "description", label: "Description", type: "textarea" }, { key: "icon_name", label: "Icon name", type: "text" }]} tableName="choose_features" onAdd={handleAdd} onDelete={handleDelete} onUpdate={handleUpdate} />}
            {activeTab === "contact" && <ContactEditor data={data.contact} onSave={handleSave} />}
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
        .editor-form { max-width: 500px; }
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
