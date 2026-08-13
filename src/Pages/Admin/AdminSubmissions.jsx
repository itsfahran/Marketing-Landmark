import React, { useState } from 'react';
import { FaEye, FaCheck, FaTrash } from 'react-icons/fa';
import './AdminModule.css';

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      name: 'Ahmed Khan',
      email: 'ahmed@example.com',
      service: 'SEO',
      status: 'new',
      date: '2024-01-20',
      message: 'I want SEO for my e-commerce store...',
    },
    {
      id: 2,
      name: 'Fatima Ali',
      email: 'fatima@example.com',
      service: 'GEO',
      status: 'contacted',
      date: '2024-01-18',
      message: 'Interested in GEO services...',
    },
  ]);

  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const handleStatusChange = (id, newStatus) => {
    setSubmissions(
      submissions.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const handleDelete = (id) => {
    if (confirm('Delete this submission?')) {
      setSubmissions(submissions.filter((s) => s.id !== id));
    }
  };

  const handleExport = () => {
    const csv = submissions
      .map((s) => `${s.name},${s.email},${s.service},${s.status},${s.date}`)
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'submissions.csv';
    a.click();
  };

  return (
    <div className="admin-module">
      <div className="module-header">
        <h2>Contact Submissions</h2>
        <button className="btn btn-primary" onClick={handleExport}>
          📥 Export CSV
        </button>
      </div>

      {submissions.length > 0 ? (
        <div className="module-table">
          <div className="table-header">
            <div>Name</div>
            <div>Email</div>
            <div>Service</div>
            <div>Status</div>
            <div>Date</div>
            <div>Actions</div>
          </div>
          {submissions.map((s) => (
            <div key={s.id} className="table-row">
              <div>{s.name}</div>
              <div>{s.email}</div>
              <div>{s.service}</div>
              <div>
                <select
                  value={s.status}
                  onChange={(e) => handleStatusChange(s.id, e.target.value)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '13px',
                  }}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>{s.date}</div>
              <div className="actions">
                <button
                  onClick={() => setSelectedSubmission(s)}
                  className="action-btn edit"
                  title="View"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="action-btn delete"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-data">No submissions yet</p>
      )}

      {selectedSubmission && (
        <div className="modal-overlay" onClick={() => setSelectedSubmission(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Submission Details</h3>
            <div style={{ marginBottom: '20px' }}>
              <p>
                <strong>Name:</strong> {selectedSubmission.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedSubmission.email}
              </p>
              <p>
                <strong>Service:</strong> {selectedSubmission.service}
              </p>
              <p>
                <strong>Status:</strong> {selectedSubmission.status}
              </p>
              <p>
                <strong>Date:</strong> {selectedSubmission.date}
              </p>
              <p>
                <strong>Message:</strong>
              </p>
              <p style={{ whiteSpace: 'pre-wrap' }}>{selectedSubmission.message}</p>
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedSubmission(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
