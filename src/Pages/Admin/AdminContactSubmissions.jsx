import React, { useState, useEffect } from "react";
import { getSupabaseClient } from "../../lib/supabase";
import { FaTrash, FaEye, FaTimes } from "react-icons/fa";
import "./AdminPages.css";
import '../../styles/admin-design-tokens.css';

export default function AdminContactSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const supabase = getSupabaseClient();

  useEffect(() => {
    loadSubmissions();
  }, [filterStatus]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error("Error loading submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      loadSubmissions();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this submission?")) {
      try {
        const { error } = await supabase
          .from("contact_submissions")
          .delete()
          .eq("id", id);

        if (error) throw error;
        loadSubmissions();
        setSelectedSubmission(null);
      } catch (error) {
        console.error("Error deleting submission:", error);
        alert("Error deleting submission");
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "#3b82f6";
      case "contacted":
        return "#f59e0b";
      case "closed":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="admin-pages">
      <div className="pages-header">
        <h2>📧 Contact Submissions</h2>
        <p>Total: {submissions.length}</p>
      </div>

      <div className="filter-buttons" style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        {["all", "new", "contacted", "closed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              background: filterStatus === status ? "#252381" : "#f0f0f0",
              color: filterStatus === status ? "white" : "black",
              fontWeight: "500",
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading submissions...</p>
      ) : submissions.length === 0 ? (
        <p style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          No submissions found
        </p>
      ) : (
        <div className="submissions-table">
          <div
            style={{
              overflowX: "auto",
              background: "white",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ background: "#f9f9f9", borderBottom: "2px solid #ddd" }}>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Name</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Email</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Service</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Status</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Date</th>
                  <th style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr
                    key={submission.id}
                    style={{
                      borderBottom: "1px solid #ddd",
                      background: submission.status === "new" ? "#f0f8ff" : "white",
                    }}
                  >
                    <td style={{ padding: "12px" }}>
                      {submission.first_name} {submission.last_name}
                    </td>
                    <td style={{ padding: "12px" }}>{submission.email}</td>
                    <td style={{ padding: "12px" }}>{submission.service_interested}</td>
                    <td style={{ padding: "12px" }}>
                      <select
                        value={submission.status}
                        onChange={(e) => handleStatusChange(submission.id, e.target.value)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "4px",
                          border: "1px solid #ddd",
                          background: getStatusColor(submission.status),
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td style={{ padding: "12px", fontSize: "12px", color: "#666" }}>
                      {formatDate(submission.created_at)}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <button
                        onClick={() => setSelectedSubmission(submission)}
                        style={{
                          background: "#2563eb",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          marginRight: "8px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <FaEye /> View
                      </button>
                      <button
                        onClick={() => handleDelete(submission.id)}
                        style={{
                          background: "#dc2626",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedSubmission && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedSubmission(null)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "8px",
              padding: "30px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2>Submission Details</h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                <FaTimes />
              </button>
            </div>

            <div style={{ display: "grid", gap: "15px" }}>
              <div>
                <strong>Name:</strong>
                <p>{selectedSubmission.first_name} {selectedSubmission.last_name}</p>
              </div>

              <div>
                <strong>Email:</strong>
                <p>
                  <a href={`mailto:${selectedSubmission.email}`}>
                    {selectedSubmission.email}
                  </a>
                </p>
              </div>

              <div>
                <strong>Service Interested:</strong>
                <p>{selectedSubmission.service_interested}</p>
              </div>

              <div>
                <strong>Status:</strong>
                <p style={{ textTransform: "capitalize" }}>{selectedSubmission.status}</p>
              </div>

              <div>
                <strong>Message:</strong>
                <p style={{ whiteSpace: "pre-wrap", background: "#f9f9f9", padding: "10px", borderRadius: "4px" }}>
                  {selectedSubmission.message}
                </p>
              </div>

              <div>
                <strong>Submitted:</strong>
                <p>{formatDate(selectedSubmission.created_at)}</p>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button
                  onClick={() => handleStatusChange(selectedSubmission.id, "contacted")}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "#f59e0b",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  Mark as Contacted
                </button>
                <button
                  onClick={() => handleStatusChange(selectedSubmission.id, "closed")}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  Mark as Closed
                </button>
                <button
                  onClick={() => handleDelete(selectedSubmission.id)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .submissions-table table tr:hover {
          background-color: #f5f5f5 !important;
        }
      `}</style>
    </div>
  );
}
