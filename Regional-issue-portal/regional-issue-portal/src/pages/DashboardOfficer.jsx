

import { useEffect, useState } from "react";
import { getAssignedIssues, getStatusCount } from "../services/officerService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import OfficerStatsChart from "../components/OfficerStatsChart";
import "bootstrap/dist/css/bootstrap.min.css";

export default function DashboardOfficer() {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔹 Load issues + stats
  const loadData = async () => {
    try {
      setLoading(true);
      const [issueData, statsData] = await Promise.all([
        getAssignedIssues(),
        getStatusCount(),
      ]);

      // ✅ Frontend safeguard: filter resolved
      const activeIssues = (issueData || []).filter(
        (issue) => issue.status !== "RESOLVED"
      );

      setIssues(activeIssues);
      setStats(statsData || {});
    } catch (error) {
      console.error("❌ Error loading officer dashboard:", error);
      toast.error("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load once on mount + auto-refresh every 30 seconds
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container py-4 min-vh-100 bg-light">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">
          👮 Officer Dashboard — Active Issues
        </h2>
      </div>

      <div className="alert alert-info small shadow-sm">
        ℹ️ Resolved issues are automatically hidden from this dashboard.
      </div>

      {/* Chart Section */}
      <div className="card shadow-sm border-0 mb-5">
        <div className="card-body">
          <h5 className="card-title text-secondary mb-3">
            📊 Issue Status Summary
          </h5>
          <OfficerStatsChart stats={stats} />
        </div>
      </div>

      {/* Issues Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {loading ? (
            <p className="text-center py-5 text-muted">Loading issues...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle mb-0">
                <thead className="bg-primary text-white">
                  <tr>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Priority</th>
                    <th>Citizen Upload</th>
                    <th>Status</th>
                    <th>Officer Feedback</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {issues.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        🎉 All assigned issues are resolved! No pending tasks.
                      </td>
                    </tr>
                  ) : (
                    issues.map((issue) => (
                      <tr key={issue.id}>
                        {/* Title */}
                        <td className="fw-semibold">{issue.title}</td>

                        {/* Location */}
                        <td>{issue.location}</td>

                        {/* Priority */}
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

                        {/* Citizen Image */}
                        <td>
                          {issue.photoUrl ? (
                            <img
                              src={`http://localhost:8000${issue.photoUrl}`}
                              alt="Citizen Upload"
                              className="rounded border"
                              style={{
                                width: "100px",
                                height: "80px",
                                objectFit: "cover",
                                cursor: "zoom-in",
                              }}
                            />
                          ) : (
                            <span className="text-muted small fst-italic">
                              No image
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td>
                          <span
                            className={`badge ${
                              issue.status === "IN_PROGRESS"
                                ? "bg-info text-dark"
                                : issue.status === "ASSIGNED"
                                ? "bg-warning text-dark"
                                : "bg-secondary"
                            }`}
                          >
                            {issue.status}
                          </span>
                        </td>

                        {/* Feedback */}
                        <td style={{ minWidth: "220px" }}>
                          {issue.officerComment ? (
                            <p className="text-muted small fst-italic mb-1">
                              💬 {issue.officerComment}
                            </p>
                          ) : (
                            <span className="text-muted small fst-italic">
                              No comment yet
                            </span>
                          )}

                          {/* Proof Image */}
                          {issue.resolvedImageUrl && (
                            <div className="mt-2">
                              <p className="small text-success fw-semibold mb-1">
                                Proof Uploaded:
                              </p>
                              <img
                                src={`http://localhost:8000${issue.resolvedImageUrl}`}
                                alt="Resolved Proof"
                                className="rounded border"
                                style={{
                                  width: "100px",
                                  height: "80px",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          )}

                          {/* Resolved Date */}
                          <p className="text-secondary small mt-2">
                            🕒 Updated At:{" "}
                            <span className="fw-semibold">
                              {issue.updatedAt
                                ? issue.updatedAt
                                    .slice(0, 19)
                                    .replace("T", " ")
                                : "—"}
                            </span>
                          </p>
                        </td>

                        {/* Actions */}
                        <td className="text-center">
                          <Link
                            to={`/officer/issue/${issue.id}`}
                            className="btn btn-sm btn-primary shadow-sm"
                          >
                            Update / View
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
