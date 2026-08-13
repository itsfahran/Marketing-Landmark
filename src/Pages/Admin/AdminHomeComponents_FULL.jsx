/**
 * Admin Home Components Manager - FULL CRUD
 * Manage all 10 home page components from one admin interface
 */

import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '../../lib/supabase';
import { FaSave, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import './AdminPages.css';

const TABS = [
  { id: 'hero', label: '🎯 Hero', color: '#2563eb' },
  { id: 'services', label: '💼 Services', color: '#7c3aed' },
  { id: 'process', label: '⚙️ Process', color: '#059669' },
  { id: 'about', label: '👤 About', color: '#dc2626' },
  { id: 'hire', label: '💰 Hire Me', color: '#f59e0b' },
  { id: 'portfolio', label: '🎨 Portfolio', color: '#06b6d4' },
  { id: 'testimonials', label: '⭐ Testimonials', color: '#8b5cf6' },
  { id: 'brands', label: '🏢 Brands', color: '#14b8a6' },
  { id: 'choose', label: '💎 Why Choose', color: '#ec4899' },
  { id: 'contact', label: '📞 Contact', color: '#6366f1' },
];

export default function AdminHomeComponents() {
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
      let result;

      switch(activeTab) {
        case 'hero':
          result = await supabase.from('hero').select('*').single();
          setData({ hero: result.data });
          break;
        case 'services':
          result = await supabase.from('services').select('*').order('sort_order');
          setData({ services: result.data || [] });
          break;
        case 'process':
          result = await supabase.from('process_steps').select('*').order('sort_order');
          setData({ process: result.data || [] });
          break;
        case 'about':
          result = await supabase.from('about').select('*').single();
          setData({ about: result.data });
          break;
        case 'hire':
          result = await supabase.from('hire_gigs').select('*').order('sort_order');
          setData({ hire: result.data || [] });
          break;
        case 'portfolio':
          result = await supabase.from('portfolio_items').select('*').order('sort_order');
          setData({ portfolio: result.data || [] });
          break;
        case 'testimonials':
          result = await supabase.from('testimonials').select('*').order('sort_order');
          setData({ testimonials: result.data || [] });
          break;
        case 'brands':
          result = await supabase.from('brands').select('*').order('sort_order');
          setData({ brands: result.data || [] });
          break;
        case 'choose':
          result = await supabase.from('choose_features').select('*').order('sort_order');
          setData({ choose: result.data || [] });
          break;
        case 'contact':
          result = await supabase.from('contact').select('*').single();
          setData({ contact: result.data });
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-pages">
      <div className="pages-header">
        <h2>🏠 Home Page Components Manager</h2>
      </div>

      {/* Tabs */}
      <div className="component-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            style={{ borderBottomColor: activeTab === tab.id ? tab.color : 'transparent' }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="component-content">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {activeTab === 'hero' && <HeroEditor data={data.hero} />}
            {activeTab === 'services' && <ServicesEditor data={data.services} />}
            {activeTab === 'process' && <ProcessEditor data={data.process} />}
            {activeTab === 'about' && <AboutEditor data={data.about} />}
            {activeTab === 'hire' && <HireEditor data={data.hire} />}
            {activeTab === 'portfolio' && <PortfolioEditor data={data.portfolio} />}
            {activeTab === 'testimonials' && <TestimonialsEditor data={data.testimonials} />}
            {activeTab === 'brands' && <BrandsEditor data={data.brands} />}
            {activeTab === 'choose' && <ChooseEditor data={data.choose} />}
            {activeTab === 'contact' && <ContactEditor data={data.contact} />}
          </>
        )}
      </div>

      <style>{`
        .component-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          flex-wrap: wrap;
          border-bottom: 2px solid #e0e0e0;
          padding-bottom: 10px;
        }

        .tab-btn {
          padding: 10px 15px;
          border: none;
          background: #f0f0f0;
          border-radius: 4px 4px 0 0;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s;
        }

        .tab-btn:hover {
          background: #e0e0e0;
        }

        .tab-btn.active {
          background: white;
        }

        .component-content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 8px 8px;
          border: 1px solid #e0e0e0;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-weight: 500;
          margin-bottom: 8px;
          color: #333;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: inherit;
        }

        .form-group textarea {
          min-height: 100px;
          resize: vertical;
        }

        .data-list {
          display: grid;
          gap: 15px;
        }

        .data-item {
          background: white;
          padding: 20px;
          border-radius: 4px;
          border: 1px solid #ddd;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 15px;
        }

        .data-item h3 {
          margin: 0 0 10px 0;
          color: #252381;
        }

        .item-actions {
          display: flex;
          gap: 10px;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
        }

        .btn-primary {
          background: #252381;
          color: white;
        }

        .btn-danger {
          background: #dc2626;
          color: white;
        }

        .btn:hover {
          opacity: 0.8;
        }
      `}