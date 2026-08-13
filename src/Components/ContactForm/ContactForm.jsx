/**
 * Unified Contact Form Component
 * Replaces the 5 duplicated hardcoded contact forms across the site
 *
 * Props:
 * - serviceOptions: array of {id, label} service options
 * - showBudgetField: bool (default false)
 * - sourcePageSlug: string, identifies which page the form was submitted from
 * - onSuccess: callback after successful submission
 */

import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPaperPlane } from 'react-icons/fa';

export default function ContactForm({
  serviceOptions = [],
  showBudgetField = false,
  sourcePageSlug = '',
  onSuccess = null,
}) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    service_interested: serviceOptions[0]?.label || '',
    budget_range: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source_page_slug: sourcePageSlug,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.message ||
          (result.errors ? result.errors.join(', ') : 'Submission failed')
        );
        return;
      }

      setSuccess(true);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        service_interested: serviceOptions[0]?.label || '',
        budget_range: '',
        message: '',
      });

      if (onSuccess) onSuccess(result);
    } catch (err) {
      setError('Network error. Please try again later.');
      console.error('Contact form error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form space-y-4">
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Thank you! We've received your message and will be in touch soon.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <FaUser className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="relative">
          <FaUser className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="relative">
        <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <input
        type="tel"
        name="phone"
        placeholder="Phone Number (optional)"
        value={formData.phone}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        name="service_interested"
        value={formData.service_interested}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select a Service</option>
        {serviceOptions.map((option) => (
          <option key={option.id} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>

      {showBudgetField && (
        <select
          name="budget_range"
          value={formData.budget_range}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Budget (optional)</option>
          <option value="49,999 - 99,999 PKR">49,999 - 99,999 PKR</option>
          <option value="99,999 - 149,999 PKR">99,999 - 149,999 PKR</option>
          <option value="149,999+ PKR">149,999+ PKR</option>
        </select>
      )}

      <textarea
        name="message"
        placeholder="Your Message"
        value={formData.message}
        onChange={handleChange}
        required
        rows="4"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-semibold flex items-center justify-center gap-2"
      >
        <FaPaperPlane /> {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
