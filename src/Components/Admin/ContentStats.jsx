import React from 'react';
import { FaEye, FaClock, FaFileAlt, FaCalendar } from 'react-icons/fa';
import './ContentStats.css';

export default function ContentStats({
  wordCount = 0,
  readingTime = 0,
  viewCount = 0,
  lastUpdated = null,
  status = 'draft',
  publishedAt = null
}) {
  const stats = [
    {
      icon: FaFileAlt,
      label: 'Word Count',
      value: wordCount.toLocaleString(),
      hint: `${wordCount} words (recommended: 300+)`
    },
    {
      icon: FaClock,
      label: 'Reading Time',
      value: `${readingTime} min`,
      hint: `Estimated reading time`
    },
    {
      icon: FaEye,
      label: 'Views',
      value: viewCount.toLocaleString(),
      hint: `Total page views`
    },
    {
      icon: FaCalendar,
      label: 'Status',
      value: status.charAt(0).toUpperCase() + status.slice(1),
      hint: publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Not published'
    }
  ];

  return (
    <div className="content-stats">
      <h3 className="stats-title">Content Statistics</h3>
      <div className="stats-grid">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="stat-card">
              <div className="stat-icon">
                <Icon />
              </div>
              <div className="stat-content">
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
                <small className="stat-hint">{stat.hint}</small>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
