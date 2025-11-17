import { useState } from "react";
import { uploadIssueImage } from "../services/citizenService";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UploadModal({ issue, onClose, refresh }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) {
      toast.error(" Please select an image first!");
      return;
    }
    try {
      setUploading(true);
      setProgress(0);

      await uploadIssueImage(issue.id, file, (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percent);
      });

      toast.success(" Image uploaded successfully!");
      onClose();
      refresh();
    } catch (error) {
      toast.error(" Upload failed. Please try again.");
      console.error(error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
      >
        <div className="modal-content shadow">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              Upload Image for <strong>{issue.title}</strong>
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            <input
              type="file"
              accept="image/*"
              className="form-control mb-3"
              onChange={(e) => setFile(e.target.files[0])}
            />

            {file && (
              <div className="text-center">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="img-fluid rounded border mb-3"
                  style={{ maxHeight: "250px" }}
                />
              </div>
            )}

            {uploading && (
              <div className="progress mb-3">
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                  role="progressbar"
                  style={{ width: `${progress}%` }}
                >
                  {progress}%
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                  ></span>
                  Uploading...
                </>
              ) : (
                <>
                  <i className="bi bi-cloud-arrow-up"></i> Upload
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
