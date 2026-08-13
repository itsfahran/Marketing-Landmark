import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '../../lib/supabase';
import './ItemManager.css';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaStar } from 'react-icons/fa';

const PricingManager = ({ pricingData, pageId, template, onClose }) => {
  const supabase = getSupabaseClient();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPackage, setEditingPackage] = useState(null);
  const [expandedPackageId, setExpandedPackageId] = useState(null);
  const pricingId = pricingData?.id;

  useEffect(() => {
    if (pricingId) {
      loadPackages();
    }
  }, [pricingId]);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const { data: pkgs } = await supabase
        .from('component_pricing_packages')
        .select(`
          *,
          features:component_pricing_features(*)
        `)
        .eq('pricing_id', pricingId)
        .order('sort_order');

      setPackages(pkgs || []);
    } catch (err) {
      console.error('Error loading packages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPackage = () => {
    const newPackage = {
      id: `temp_${Date.now()}`,
      name: '',
      subtitle: '',
      price: '',
      currency: 'PKR',
      billing_period: 'Month',
      pages: '',
      is_popular: false,
      sort_order: packages.length,
      features: [],
      isNew: true,
    };
    setPackages([...packages, newPackage]);
    setEditingPackage(newPackage);
  };

  const handleSavePackage = async (pkg) => {
    if (!pricingId) {
      alert('Please save the Pricing component first');
      return;
    }

    try {
      if (pkg.isNew) {
        const { data } = await supabase
          .from('component_pricing_packages')
          .insert({
            pricing_id: pricingId,
            name: pkg.name,
            subtitle: pkg.subtitle,
            price: pkg.price,
            currency: pkg.currency,
            billing_period: pkg.billing_period,
            pages: pkg.pages,
            is_popular: pkg.is_popular,
            sort_order: pkg.sort_order,
          })
          .select()
          .single();

        // Save features if any
        if (pkg.features?.length > 0) {
          await supabase.from('component_pricing_features').insert(
            pkg.features.map((f, idx) => ({
              package_id: data.id,
              feature_text: f.feature_text,
              is_included: f.is_included !== false,
              sort_order: idx,
            }))
          );
        }
      } else {
        await supabase
          .from('component_pricing_packages')
          .update({
            name: pkg.name,
            subtitle: pkg.subtitle,
            price: pkg.price,
            currency: pkg.currency,
            billing_period: pkg.billing_period,
            pages: pkg.pages,
            is_popular: pkg.is_popular,
          })
          .eq('id', pkg.id);
      }

      setEditingPackage(null);
      loadPackages();
    } catch (err) {
      console.error('Error saving package:', err);
      alert('Error saving package: ' + err.message);
    }
  };

  const handleDeletePackage = async (packageId) => {
    if (!window.confirm('Delete this package and all its features?')) return;

    try {
      await supabase.from('component_pricing_packages').delete().eq('id', packageId);
      loadPackages();
    } catch (err) {
      console.error('Error deleting package:', err);
      alert('Error deleting package');
    }
  };

  const handleAddFeature = (packageId) => {
    const pkg = packages.find(p => p.id === packageId);
    if (!pkg) return;

    const newFeature = {
      id: `temp_${Date.now()}`,
      feature_text: '',
      is_included: true,
      isNew: true,
    };

    const updated = packages.map(p =>
      p.id === packageId
        ? { ...p, features: [...(p.features || []), newFeature] }
        : p
    );
    setPackages(updated);
  };

  const handleDeleteFeature = (packageId, featureIndex) => {
    const updated = packages.map(p =>
      p.id === packageId
        ? {
            ...p,
            features: p.features.filter((_, idx) => idx !== featureIndex),
          }
        : p
    );
    setPackages(updated);
  };

  const handleSaveAllFeatures = async (packageId) => {
    const pkg = packages.find(p => p.id === packageId);
    if (!pkg) return;

    try {
      // Delete existing features
      await supabase
        .from('component_pricing_features')
        .delete()
        .eq('package_id', packageId);

      // Save new features
      if (pkg.features?.length > 0) {
        await supabase.from('component_pricing_features').insert(
          pkg.features.map((f, idx) => ({
            package_id: packageId,
            feature_text: f.feature_text,
            is_included: f.is_included !== false,
            sort_order: idx,
          }))
        );
      }

      loadPackages();
      alert('Features saved!');
    } catch (err) {
      console.error('Error saving features:', err);
      alert('Error saving features: ' + err.message);
    }
  };

  return (
    <div className="item-manager-modal">
      <div className="item-manager-content">
        <div className="item-manager-header">
          <h3>Manage Pricing Packages ({template})</h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading packages...</div>
        ) : (
          <>
            <div className="cards-list">
              {packages.length === 0 ? (
                <p className="no-items">No packages yet. Add your first package!</p>
              ) : (
                packages.map((pkg) => (
                  <div key={pkg.id}>
                    <div className="package-item">
                      <div className="package-info">
                        <strong>
                          {pkg.name || 'Untitled'}
                          {pkg.is_popular && <FaStar style={{ marginLeft: '8px', color: '#f59e0b' }} />}
                        </strong>
                        <span>PKR {pkg.price || '0'} / {pkg.billing_period || 'Month'}</span>
                      </div>

                      <div className="package-actions">
                        <button
                          className="edit-btn"
                          onClick={() => setEditingPackage(pkg)}
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeletePackage(pkg.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    {/* Features for this package */}
                    {!pkg.isNew && (
                      <div className="features-section">
                        <h5>Features ({pkg.features?.length || 0})</h5>

                        {pkg.features?.map((feature, idx) => (
                          <div key={feature.id || idx} className="feature-item">
                            <input
                              type="checkbox"
                              checked={feature.is_included}
                              onChange={(e) => {
                                const updated = packages.map(p =>
                                  p.id === pkg.id
                                    ? {
                                        ...p,
                                        features: p.features.map((f, i) =>
                                          i === idx ? { ...f, is_included: e.target.checked } : f
                                        ),
                                      }
                                    : p
                                );
                                setPackages(updated);
                              }}
                            />
                            <span className="feature-text">{feature.feature_text}</span>
                            <button
                              className="feature-delete-btn"
                              onClick={() => handleDeleteFeature(pkg.id, idx)}
                            >
                              ✕
                            </button>
                          </div>
                        ))}

                        <button
                          className="add-btn"
                          style={{ marginTop: '8px', width: '100%' }}
                          onClick={() => handleAddFeature(pkg.id)}
                        >
                          <FaPlus /> Add Feature
                        </button>

                        <button
                          className="save-btn"
                          style={{ marginTop: '8px', width: '100%' }}
                          onClick={() => handleSaveAllFeatures(pkg.id)}
                        >
                          <FaSave /> Save Features
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <button className="add-btn" onClick={handleAddPackage}>
              <FaPlus /> Add New Package
            </button>
          </>
        )}

        {editingPackage && !editingPackage.isNew && (
          <div className="edit-modal-overlay">
            <div className="edit-modal">
              <h4>Edit Package</h4>

              <div className="form-group">
                <label>Package Name *</label>
                <input
                  type="text"
                  value={editingPackage.name}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, name: e.target.value })
                  }
                  placeholder="e.g., Basic, Standard, Premium"
                />
              </div>

              <div className="form-group">
                <label>Subtitle</label>
                <input
                  type="text"
                  value={editingPackage.subtitle}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, subtitle: e.target.value })
                  }
                  placeholder="e.g., Best for Startups"
                />
              </div>

              <div className="form-group">
                <label>Price *</label>
                <input
                  type="number"
                  value={editingPackage.price}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, price: e.target.value })
                  }
                  placeholder="59,999"
                />
              </div>

              <div className="form-group">
                <label>Currency</label>
                <select
                  value={editingPackage.currency}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, currency: e.target.value })
                  }
                >
                  <option value="PKR">PKR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              <div className="form-group">
                <label>Billing Period</label>
                <select
                  value={editingPackage.billing_period}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, billing_period: e.target.value })
                  }
                >
                  <option value="Month">/Month</option>
                  <option value="Year">/Year</option>
                  <option value="Project">/Project</option>
                </select>
              </div>

              <div className="form-group">
                <label>Pages/Coverage</label>
                <input
                  type="text"
                  value={editingPackage.pages}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, pages: e.target.value })
                  }
                  placeholder="e.g., Upto 10 Pages"
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={editingPackage.is_popular}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, is_popular: e.target.checked })
                    }
                  />
                  {' '}Mark as Popular/Featured
                </label>
              </div>

              <div className="modal-actions">
                <button
                  className="save-btn"
                  onClick={() => handleSavePackage(editingPackage)}
                >
                  <FaSave /> Save Package
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setEditingPackage(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingManager;
