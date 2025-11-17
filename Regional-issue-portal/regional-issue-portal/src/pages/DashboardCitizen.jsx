

import { useEffect, useState } from "react";
import { getMyIssues, reopenIssue } from "../services/citizenService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import UploadModal from "../components/UploadModal";
import "bootstrap/dist/css/bootstrap.min.css";

export default function DashboardCitizen() {
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // For hover zoom

  const fetchIssues = async () => {
    try {
      const data = await getMyIssues();
      setIssues(data || []);
    } catch (err) {
      console.error("❌ Failed to fetch issues:", err);
      toast.error("Failed to load issues");
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // 🔁 Reopen resolved issue
  const handleReopen = async (id) => {
    if (!window.confirm("Are you sure you want to reopen this issue?")) return;
    try {
      await reopenIssue(id);
      toast.info("🔁 Issue reopened successfully! Officer will review again.");
      fetchIssues();
    } catch (err) {
      toast.error("❌ Failed to reopen issue.");
    }
  };

  return (
    <div className="container py-4 min-vh-100 bg-light">
      {/* 🔹 Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">📋 My Reported Issues</h2>
        <Link
          to="/citizen/report"
          className="btn btn-warning text-dark fw-semibold shadow-sm"
        >
          + Report New Issue
        </Link>
      </div>

      {/* 🔹 Table Section */}
      <div className="card shadow border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-primary text-white">
                <tr>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Details</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {issues.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No issues found.
                    </td>
                  </tr>
                ) : (
                  issues.map((issue) => (
                    <tr key={issue.id}>
                      <td className="fw-semibold">{issue.title}</td>
                      <td>{issue.location}</td>
                      <td>
                        <span
                          className={`badge ${
                            issue.priority === "HIGH"
                              ? "bg-danger"
                              : issue.priority === "MEDIUM"
                              ? "bg-warning text-dark"
                              : "bg-success"
                          }`}
                        >
                          {issue.priority}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            issue.status === "RESOLVED"
                              ? "bg-success"
                              : issue.status === "PENDING"
                              ? "bg-warning text-dark"
                              : issue.status === "REOPENED"
                              ? "bg-danger"
                              : "bg-info text-dark"
                          }`}
                        >
                          {issue.status}
                        </span>
                      </td>

                      {/* Details Column */}
                      <td style={{ minWidth: "240px" }}>
                        {/* Citizen Image */}
                        {issue.photoUrl && (
                          <div className="mb-2">
                            <small className="text-secondary fw-semibold">
                              Citizen Image:
                            </small>
                            <br />
                            <img
                              src={`http://localhost:8000${issue.photoUrl}`}
                              alt="Citizen Upload"
                              className="rounded border mt-1"
                              style={{
                                width: "100px",
                                height: "80px",
                                objectFit: "cover",
                                cursor: "zoom-in",
                              }}
                              onClick={() =>
                                setPreviewImage(
                                  `http://localhost:8000${issue.photoUrl}`
                                )
                              }
                            />
                          </div>
                        )}

                        {/* Officer Image */}
                        {issue.resolvedImageUrl && (
                          <div className="mb-2">
                            <small className="text-success fw-semibold">
                              Officer Proof:
                            </small>
                            <br />
                            <img
                              src={`http://localhost:8000${issue.resolvedImageUrl}`}
                              alt="Resolved Proof"
                              className="rounded border mt-1"
                              style={{
                                width: "100px",
                                height: "80px",
                                objectFit: "cover",
                                cursor: "zoom-in",
                              }}
                              onClick={() =>
                                setPreviewImage(
                                  `http://localhost:8000${issue.resolvedImageUrl}`
                                )
                              }
                            />
                          </div>
                        )}

                        {/* Officer Comment */}
                        {issue.officerComment && (
                          <p className="text-muted small fst-italic">
                            💬 {issue.officerComment}
                          </p>
                        )}

                        {/* Officer Info */}
                        <p className="small text-secondary mb-0">
                          👮 Assigned Officer:{" "}
                          <span className="fw-semibold text-dark">
                            {issue.assignedOfficer?.username || "Not Assigned"}
                          </span>
                        </p>

                        {/* Resolved Date */}
                        <p className="small text-secondary">
                          🕒 Resolved At:{" "}
                          <span className="fw-semibold">
                            {issue.resolvedAt
                              ? issue.resolvedAt.slice(0, 19).replace("T", " ")
                              : "—"}
                          </span>
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="text-center">
                        <div className="d-flex flex-column gap-2 align-items-center">
                          {/* Upload button */}
                          <button
                            onClick={() => {
                              setSelectedIssue(issue);
                              setShowModal(true);
                            }}
                            className="btn btn-sm btn-primary shadow-sm"
                          >
                            Upload Image
                          </button>

                          {/* Reopen button */}
                          {issue.status === "RESOLVED" && (
                            <button
                              className="btn btn-sm btn-warning text-dark fw-semibold"
                              onClick={() => handleReopen(issue.id)}
                            >
                              🔁 Reopen Issue
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && selectedIssue && (
        <UploadModal
          issue={selectedIssue}
          onClose={() => setShowModal(false)}
          refresh={fetchIssues}
        />
      )}

      {/* 🖼️ Image Preview Modal */}
      {previewImage && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage}
              alt="Preview"
              className="img-fluid rounded shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}

