import { useState } from "react";
import { createIssue, uploadIssueImage } from "../services/citizenService";
import { toast } from "react-toastify";

export default function IssueForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [createdIssueId, setCreatedIssueId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);
    try {
      const issueData = { title, description, location, priority };

      const res = await createIssue(issueData);
      const issueId = res?.issue?.id;

      if (!issueId) {
        toast.error("⚠️ Issue created but no ID returned from backend!");
        setLoading(false);
        return;
      }

      setCreatedIssueId(issueId);
      toast.success(res.message || "✅ Issue created successfully!");

      
      if (file) {
        const uploadRes = await uploadIssueImage(issueId, file, (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        });
        toast.success(uploadRes?.message || "📸 Image uploaded successfully!");
      }

      
      setTitle("");
      setDescription("");
      setLocation("");
      setPriority("LOW");
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error("❌ Error creating issue:", err);
      toast.error("Failed to create issue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const priorityColor = {
    LOW: "success",
    MEDIUM: "warning",
    HIGH: "danger",
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: "600px" }}>
        <div className="card-body">
          <h3 className="card-title text-center text-primary mb-4">
            📝 Report an Issue
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label fw-semibold">
                Issue Title
              </label>
              <input
                id="title"
                className="form-control"
                placeholder="Enter issue title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label fw-semibold">
                Description
              </label>
              <textarea
                id="description"
                className="form-control"
                rows="4"
                placeholder="Describe the issue"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="location" className="form-label fw-semibold">
                Location
              </label>
              <input
                id="location"
                className="form-control"
                placeholder="Enter location details"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="priority" className="form-label fw-semibold">
                Priority{" "}
                <span className={`badge bg-${priorityColor[priority]}`}>
                  {priority}
                </span>
              </label>
              <select
                id="priority"
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Attach Image</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleFileChange}
              />
              {preview && (
                <div className="text-center mt-3">
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      maxHeight: "250px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              )}
            </div>

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
              type="submit"
              className="btn btn-primary w-100 fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Submitting...
                </>
              ) : (
                "Submit Issue"
              )}
            </button>
          </form>

          {createdIssueId && (
            <div className="alert alert-success text-center mt-4" role="alert">
              ✅ Issue ID <strong>{createdIssueId}</strong> submitted successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
