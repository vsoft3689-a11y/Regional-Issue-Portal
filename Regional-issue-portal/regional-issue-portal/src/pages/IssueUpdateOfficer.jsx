
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getAssignedIssues,
  updateStatus,
  addComment,
  uploadResolvedImage,
} from "../services/officerService";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

export default function IssueUpdateOfficer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showCitizenModal, setShowCitizenModal] = useState(false);

 
  const fetchIssue = async () => {
    try {
      const issues = await getAssignedIssues();
      const found = issues.find((i) => i.id === Number(id));
      if (!found) {
        toast.warning("⚠️ Issue not assigned or already fully completed.");
        navigate("/officer/dashboard");
        return;
      }
      setIssue(found);
      setStatus(found.status);
    } catch (error) {
      console.error("Error fetching issue:", error);
      toast.error("Failed to load issue details.");
    }
  };

  useEffect(() => {
    fetchIssue();
  }, [id]);

  
  const handleStatusUpdate = async () => {
    if (!window.confirm(`Change status to "${status}"?`)) return;
    try {
      await updateStatus(id, status);
      toast.success("✅ Status updated!");
      fetchIssue();
    } catch {
      toast.error("Failed to update issue.");
    }
  };

  
  const handleAddComment = async () => {
    if (!comment.trim()) return toast.warning("Please enter a comment first.");
    try {
      await addComment(id, comment);
      toast.success("💬 Comment added!");
      setComment("");
      fetchIssue();
    } catch {
      toast.error("Failed to add comment.");
    }
  };

  // Upload resolved proof image
  const handleImageUpload = async () => {
    if (!file) return toast.warning("Select an image first!");
    setLoading(true);
    setUploadProgress(0);
    try {
      await uploadResolvedImage(id, file, (e) => {
        const percent = Math.round((e.loaded * 100) / e.total);
        setUploadProgress(percent);
      });
      toast.success("📸 Proof uploaded successfully!");
      fetchIssue();
    } catch {
      toast.error("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!issue) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="text-muted">Loading issue details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 min-vh-100 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">
          🛠 Manage Issue — {issue.title}
        </h2>
        <button
          onClick={() => navigate("/officer/dashboard")}
          className="btn btn-outline-primary fw-semibold"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Citizen Report */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white fw-semibold d-flex justify-content-between">
          Citizen Report
          <button
            className="btn btn-sm btn-light text-primary"
            onClick={() => setShowCitizenModal(true)}
          >
            View Citizen Details
          </button>
        </div>
        <div className="card-body">
          <p>
            <strong>📍 Location:</strong> {issue.location}
          </p>
          <p>
            <strong>⚡ Priority:</strong>{" "}
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
          </p>
          <p>
            <strong>🕒 Status:</strong>{" "}
            <span className={`badge bg-info text-dark`}>{issue.status}</span>
          </p>

          {issue.photoUrl && (
            <div className="mt-3">
              <p className="text-muted small mb-1">Citizen Uploaded Image:</p>
              <img
                src={`http://localhost:8000${issue.photoUrl}`}
                alt="Citizen upload"
                className="img-fluid rounded border"
                style={{ maxWidth: "350px" }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Update Status */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-secondary text-white fw-semibold">
          Update Status
        </div>
        <div className="card-body d-flex align-items-center gap-2 flex-wrap">
          <select
            className="form-select w-auto"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="ASSIGNED">ASSIGNED</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
          <button
            onClick={handleStatusUpdate}
            className="btn btn-primary fw-semibold"
          >
            Save
          </button>
        </div>
      </div>

      {/* Add Comment */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-success text-white fw-semibold">
          Officer Comments
        </div>
        <div className="card-body">
          <textarea
            rows="3"
            placeholder="Type your comment..."
            className="form-control mb-3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            onClick={handleAddComment}
            className="btn btn-success fw-semibold"
          >
            Submit Comment
          </button>

          {issue.officerComment && (
            <div className="alert alert-secondary mt-3 mb-0">
              💬 <em>{issue.officerComment}</em>
            </div>
          )}
        </div>
      </div>

      {/* Upload Proof */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-warning text-dark fw-semibold">
          Upload Resolved Proof
        </div>
        <div className="card-body">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="form-control mb-3"
          />

          {file && (
            <div className="text-center mb-3">
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="img-fluid rounded border"
                style={{ maxWidth: "350px" }}
              />
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="progress mb-3">
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: `${uploadProgress}%` }}
              >
                {uploadProgress}%
              </div>
            </div>
          )}

          <button
            onClick={handleImageUpload}
            disabled={loading}
            className="btn btn-warning text-dark fw-semibold"
          >
            {loading ? "Uploading..." : "Upload Proof"}
          </button>

          {issue.resolvedImageUrl && (
            <div className="mt-4">
              <p className="text-muted small mb-1">Existing Proof:</p>
              <img
                src={`http://localhost:8000${issue.resolvedImageUrl}`}
                alt="Resolved Proof"
                className="img-fluid rounded border"
                style={{ maxWidth: "350px" }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Citizen Details Modal */}
      {showCitizenModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowCitizenModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Citizen Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCitizenModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>👤 Username:</strong>{" "}
                  {issue.citizen?.username || "N/A"}
                </p>
                <p>
                  <strong>📧 Email:</strong>{" "}
                  {issue.citizen?.email || "Not provided"}
                </p>
                <p>
                  <strong>📞 Contact:</strong>{" "}
                  {issue.citizen?.phone || "N/A"}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowCitizenModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
