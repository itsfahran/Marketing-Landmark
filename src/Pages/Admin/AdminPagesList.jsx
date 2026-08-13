import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSupabaseClient } from '../../lib/supabase';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import './AdminPagesList.css';

const AdminPagesList = () => {
  const navigate = useNavigate();
  const supabase = getSupabaseClient();

  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (err) {
      console.error('Error loading pages:', err);
      alert('Error loading pages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pageId) => {
    if (!window.confirm('Delete this page?')) return;

    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', pageId);

      if (error) throw error;
      setPages(pages.filter(p => p.id !== pageId));
    } catch (err) {
      alert('Error deleting page');
    }
  };

  const toggleStatus = async (pageId, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await supabase
        .from('pages')
        .update({ status: newStatus })
        .eq('id', pageId);

      setPages(pages.map(p =>
        p.id === pageId ? { ...p, status: newStatus } : p
      ));
    } catch (err) {
      alert('Error updating page');
    }
  };

  return (
    <div className="apl-container">
      <div className="apl-header">
        <h1>Pages</h1>
        <button
          className="apl-new-btn"
          onClick={() => navigate('/admin/pages/new')}
        >
          <FaPlus /> New Page
        </button>
      </div>

      {loading ? (
        <div className="apl-loading">Loading pages...</div>
      ) : pages.length === 0 ? (
        <div className="apl-empty">
          <p>No pages created yet</p>
          <button onClick={() => navigate('/admin/pages/new')}>
            Create First Page
          </button>
        </div>
      ) : (
        <div className="apl-table-wrapper">
          <table className="apl-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Created</th>
                <th>Components</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map(page => {
                const compCount = page.components_config?.length || 0;
                const enabledCount = page.components_config?.filter(c => c.enabled).length || 0;

                return (
                  <tr key={page.id}>
                    <td className="apl-name">{page.name}</td>
                    <td className="apl-slug">
                      <code>{page.slug}</code>
                    </td>
                    <td>
                      <span className={`apl-status apl-${page.status}`}>
                        {page.status === 'published' ? (
                          <>
                            <FaEye /> Published
                          </>
                        ) : (
                          <>
                            <FaEyeSlash /> Draft
                          </>
                        )}
                      </span>
                    </td>
                    <td className="apl-date">
                      {new Date(page.created_at).toLocaleDateString()}
                    </td>
                    <td className="apl-components">
                      {enabledCount}/{compCount}
                    </td>
                    <td className="apl-actions">
                      <button
                        className="apl-btn apl-edit"
                        onClick={() => navigate(`/admin/pages/${page.id}`)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="apl-btn apl-toggle"
                        onClick={() => toggleStatus(page.id, page.status)}
                        title={page.status === 'published' ? 'Unpublish' : 'Publish'}
                      >
                        {page.status === 'published' ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      <button
                        className="apl-btn apl-delete"
                        onClick={() => handleDelete(page.id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPagesList;
