
import { useEffect, useState } from "react";
import {
  getAllIssues,
  assignIssue,
  deleteIssue,
  getAllOfficers,
} from "../services/adminService";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminIssues() {
  const [issues, setIssues] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [loading, setLoading] = useState(false);

  const location = useLocation(); 

  
  const loadIssues = async () => {
    try {
      const data = await getAllIssues();
      setIssues(data);
    } catch (err) {
      toast.error("Failed to load issues");
      console.error(err);
    }
  };


  const loadOfficers = async () => {
    try {
      const data = await getAllOfficers();
      setOfficers(data);
    } catch (err) {
      console.error(err);
    }
  };

  
  useEffect(() => {
    loadIssues();
    loadOfficers();
  }, [location.pathname]); 

 
  const handleAssign = async (issueId) => {
    if (!selectedOfficer) {
      toast.warning("Please select an officer before assigning.");
      return;
    }

    try {
      setLoading(true);
      await assignIssue(issueId, selectedOfficer);

      toast.success(`Assigned to Officer ${selectedOfficer}`);
      setSelectedOfficer("");
      setSelectedIssueId(null);

      loadIssues(); 
      toast.error("Failed to assign issue");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Delete this issue?")) return;

    try {
      await deleteIssue(id);
      toast.success("Issue deleted.");

      loadIssues();
    } catch (err) {
      toast.error("Failed to delete issue");
    }
  };

  return (
    <div className="container-fluid py-4">
      <h2 className="fw-bold text-primary mb-4">🧾 Manage Issues</h2>

      <div className="table-responsive shadow-sm bg-white rounded">
        <table className="table table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Citizen</th>
              <th>Location</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Officer</th>
              <th>Assign</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id}>
                <td>{issue.id}</td>
                <td className="fw-semibold">{issue.title}</td>
                <td>{issue.citizen?.username}</td>
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
                        : issue.status === "IN_PROGRESS"
                        ? "bg-info text-dark"
                        : issue.status === "ASSIGNED"
                        ? "bg-primary"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {issue.status}
                  </span>
                </td>

                <td>{issue.assignedOfficer?.username || "Unassigned"}</td>

                {/* Assign section */}
                <td>
                  <div className="d-flex gap-2">
                    <select
                      className="form-select form-select-sm"
                      value={
                        selectedIssueId === issue.id ? selectedOfficer : ""
                      }
                      onChange={(e) => {
                        setSelectedIssueId(issue.id);
                        setSelectedOfficer(e.target.value);
                      }}
                    >
                      <option value="">Select Officer</option>
                      {officers.map((officer) => (
                        <option key={officer.id} value={officer.username}>
                          {officer.username}
                        </option>
                      ))}
                    </select>

                    <button
                      className="btn btn-primary btn-sm"
                      disabled={loading || issue.assignedOfficer}
                      onClick={() => handleAssign(issue.id)}
                    >
                      Assign
                    </button>
                  </div>
                </td>

                {/* Delete Button */}
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(issue.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
