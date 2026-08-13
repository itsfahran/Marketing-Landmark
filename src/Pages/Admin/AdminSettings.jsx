import React, { useState } from 'react';
import './AdminModule.css';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'Marketing Landmark',
    contactEmail: 'contact@seoprofessional.pk',
    contactPhone: '+92 327 2462207',
    contactAddress: 'Pakistan',
    facebook: 'https://facebook.com',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    googleAnalyticsId: 'G-XXXXXXXX',
    googleTagManagerId: 'GTM-XXXXXXXX',
    llmsText: '# LLMs.txt\nYour content here',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  return (
    <div className="admin-module">
      <h2>Site Settings</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        <div className="form-group">
          <label>Site Name</label>
          <input
            type="text"
            name="siteName"
            value={settings.siteName}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Contact Email</label>
          <input
            type="email"
            name="contactEmail"
            value={settings.contactEmail}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Contact Phone</label>
          <input
            type="tel"
            name="contactPhone"
            value={settings.contactPhone}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Contact Address</label>
          <input
            type="text"
            name="contactAddress"
            value={settings.contactAddress}
            onChange={handleInputChange}
          />
        </div>

        <h3 style={{ marginTop: '30px', color: '#252381' }}>Social Links</h3>

        <div className="form-group">
          <label>Facebook</label>
          <input
            type="url"
            name="facebook"
            value={settings.facebook}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>LinkedIn</label>
          <input
            type="url"
            name="linkedin"
            value={settings.linkedin}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Instagram</label>
          <input
            type="url"
            name="instagram"
            value={settings.instagram}
            onChange={handleInputChange}
          />
        </div>

        <h3 style={{ marginTop: '30px', color: '#252381' }}>Analytics</h3>

        <div className="form-group">
          <label>Google Analytics ID</label>
          <input
            type="text"
            name="googleAnalyticsId"
            value={settings.googleAnalyticsId}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Google Tag Manager ID</label>
          <input
            type="text"
            name="googleTagManagerId"
            value={settings.googleTagManagerId}
            onChange={handleInputChange}
          />
        </div>

        <h3 style={{ marginTop: '30px', color: '#252381' }}>LLMs.txt Content</h3>

        <div className="form-group">
          <label>LLMs.txt (Markdown)</label>
          <textarea
            name="llmsText"
            value={settings.llmsText}
            onChange={handleInputChange}
            rows="10"
          />
        </div>

        <div className="form-actions" style={{ marginTop: '30px' }}>
          <button type="submit" className="btn btn-primary">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
