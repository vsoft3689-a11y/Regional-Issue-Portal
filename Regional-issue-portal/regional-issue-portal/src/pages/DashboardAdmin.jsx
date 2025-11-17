import { useEffect, useState } from "react";
import {
  getDashboardStats,
  getIssueStatusCounts,
  getAllIssues,
} from "../services/adminService";
import { toast } from "react-toastify";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function DashboardAdmin() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalIssues: 0,
    resolvedIssues: 0,
    pendingIssues: 0,
  });
  const [statusData, setStatusData] = useState([]);
  const [recentIssues, setRecentIssues] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const navigate = useNavigate();

  const COLORS = ["#0d6efd", "#ffc107", "#198754", "#dc3545"];

  const loadStats = async () => {
    try {
      const [dashRes, issueRes, issuesList] = await Promise.all([
        getDashboardStats(),
        getIssueStatusCounts(),
        getAllIssues(),
      ]);

      setStats({
        totalUsers: dashRes.totalUsers || 0,
        totalIssues: dashRes.totalIssues || 0,
        resolvedIssues: dashRes.resolvedIssues || 0,
        pendingIssues: dashRes.pendingIssues || 0,
      });

      const statusArray = Object.entries(issueRes).map(([key, value]) => ({
        name: key,
        value: value || 0,
      }));
      setStatusData(statusArray);

      const sortedIssues = (issuesList || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecentIssues(sortedIssues.slice(0, 10));

      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error(" Error loading admin stats:", error);
      toast.error("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(loadStats, 15000); // refresh every 15 seconds
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handlePieClick = (data) => {
    if (data?.name) {
      const status = data.name.toUpperCase();
      toast.info(`Filtering issues by: ${status}`);
      navigate(`/admin/issues?status=${status}`);
    }
  };

  // Filter issues by search query
  const filteredIssues = recentIssues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-4 min-vh-100 bg-light">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">🧭 Admin Dashboard</h2>
        <div className="d-flex align-items-center gap-3">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              id="autoRefreshSwitch"
            />
            <label htmlFor="autoRefreshSwitch" className="form-check-label small">
              Auto Refresh
            </label>
          </div>
          {lastUpdated && (
            <small className="text-muted">
              Last updated: <strong>{lastUpdated}</strong>
            </small>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-5">
        <SummaryCard
          color="primary"
          icon="👥"
          title="Total Users"
          value={stats.totalUsers}
        />
        <SummaryCard
          color="info"
          icon="📋"
          title="Total Issues"
          value={stats.totalIssues}
        />
        <SummaryCard
          color="success"
          icon="✅"
          title="Resolved"
          value={stats.resolvedIssues}
        />
        <SummaryCard
          color="warning"
          icon="🕓"
          title="Pending"
          value={stats.pendingIssues}
        />
      </div>

      {/* Pie Chart */}
      <div className="card shadow-sm border-0 mb-5">
        <div className="card-body" style={{ height: "400px" }}>
          <h5 className="card-title text-primary mb-3">
            📊 Issue Status Overview (Click to Filter)
          </h5>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  nameKey="name"
                  onClick={handlePieClick}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                      style={{ cursor: "pointer" }}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted mt-5">
              No issue status data available.
            </p>
          )}
        </div>
      </div>

      {/* Recent Issues */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title text-primary mb-0">
              🕒 Recent Citizen Issues
            </h5>
            <input
              type="text"
              className="form-control w-auto"
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ maxWidth: "250px" }}
            />
          </div>

          {filteredIssues.length === 0 ? (
            <p className="text-muted">No matching issues found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-primary text-white">
                  <tr>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Image</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIssues.map((issue) => (
                    <tr
                      key={issue.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/admin/issues/${issue.id}`)}
                    >
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
                              : "bg-info text-dark"
                          }`}
                        >
                          {issue.status}
                        </span>
                      </td>
                      <td>
                        {issue.photoUrl ? (
                          <a
                            href={`http://localhost:8000${issue.photoUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none text-primary fw-semibold"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View Image
                          </a>
                        ) : (
                          <span className="text-muted small">No Image</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


function SummaryCard({ color, icon, title, value }) {
  return (
    <div className="col-6 col-md-3">
      <div
        className={`card shadow-sm border-0 text-center py-3 bg-${color}-subtle`}
      >
        <p className="text-secondary mb-1">
          <span className="fs-5">{icon}</span> {title}
        </p>
        <h4 className={`fw-bold text-${color}`}>{value}</h4>
      </div>
    </div>
  );
}
