import React from 'react';
import { FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import './SEOScoreDisplay.css';

export default function SEOScoreDisplay({ score = 0, data = {} }) {
  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    if (score >= 40) return '#FFC107';
    return '#f44336';
  };

  const getScoreStatus = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const checks = [
    {
      name: 'Meta Title',
      status: data.meta_title?.length >= 30 && data.meta_title?.length <= 60 ? 'pass' : 'fail',
      hint: `${data.meta_title?.length || 0}/30-60 chars`,
      icon: data.meta_title?.length >= 30 && data.meta_title?.length <= 60 ? FaCheck : FaTimes
    },
    {
      name: 'Meta Description',
      status: data.meta_description?.length >= 120 && data.meta_description?.length <= 160 ? 'pass' : 'fail',
      hint: `${data.meta_description?.length || 0}/120-160 chars`,
      icon: data.meta_description?.length >= 120 && data.meta_description?.length <= 160 ? FaCheck : FaTimes
    },
    {
      name: 'Focus Keyword',
      status: data.focus_keyword ? 'pass' : 'fail',
      hint: data.focus_keyword || 'Not set',
      icon: data.focus_keyword ? FaCheck : FaTimes
    },
    {
      name: 'Alt Text',
      status: data.featured_image_alt_text || data.images_with_alt_count > 0 ? 'pass' : 'fail',
      hint: data.featured_image_alt_text ? 'Present' : 'Missing',
      icon: data.featured_image_alt_text || data.images_with_alt_count > 0 ? FaCheck : FaTimes
    },
    {
      name: 'Content Length',
      status: data.word_count >= 300 ? 'pass' : 'warning',
      hint: `${data.word_count || 0} words`,
      icon: data.word_count >= 300 ? FaCheck : FaExclamationTriangle
    },
    {
      name: 'Canonical URL',
      status: data.canonical_url ? 'pass' : 'fail',
      hint: data.canonical_url ? 'Set' : 'Not set',
      icon: data.canonical_url ? FaCheck : FaTimes
    },
    {
      name: 'Open Graph Tags',
      status: data.og_title && data.og_description ? 'pass' : 'warning',
      hint: data.og_title ? 'Configured' : 'Incomplete',
      icon: data.og_title && data.og_description ? FaCheck : FaExclamationTriangle
    },
    {
      name: 'Published Status',
      status: data.status === 'published' ? 'pass' : 'warning',
      hint: data.status ? `${data.status}` : 'Draft',
      icon: data.status === 'published' ? FaCheck : FaExclamationTriangle
    }
  ];

  return (
    <div className="seo-score-display">
      <div className="seo-score-card">
        <div className="score-circle" style={{ borderColor: getScoreColor(score) }}>
          <div className="score-value">{score}</div>
          <div className="score-max">/100</div>
        </div>
        <div className="score-info">
          <h3 className="score-status" style={{ color: getScoreColor(score) }}>
            {getScoreStatus(score)}
          </h3>
          <p className="score-description">
            {score >= 80 && 'Great SEO optimization! Your content is well-optimized.'}
            {score >= 60 && score < 80 && 'Good optimization. Make a few tweaks to improve further.'}
            {score >= 40 && score < 60 && 'Fair optimization. There are several improvements needed.'}
            {score < 40 && 'Needs improvement. Focus on the checklist items below.'}
          </p>
        </div>
      </div>

      <div className="seo-checklist">
        <h4 className="checklist-title">SEO Checklist</h4>
        <div className="checks-grid">
          {checks.map((check, idx) => {
            const IconComponent = check.icon;
            return (
              <div key={idx} className={`check-item check-${check.status}`}>
                <div className="check-icon">
                  <IconComponent />
                </div>
                <div className="check-content">
                  <p className="check-name">{check.name}</p>
                  <small className="check-hint">{check.hint}</small>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
