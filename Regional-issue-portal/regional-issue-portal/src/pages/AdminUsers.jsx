import { useEffect, useState } from "react";
import { getUsers } from "../services/userService";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.data || []);
      setFilteredUsers(res.data || []);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  
  useEffect(() => {
    let data = [...users];
    if (filterRole !== "ALL") {
      data = data.filter((user) => user.role === filterRole);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (u) =>
          u.username.toLowerCase().includes(query) ||
          u.fullName.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query)
      );
    }
    setFilteredUsers(data);
  }, [searchQuery, filterRole, users]);

  return (
    <div className="container py-5 min-vh-100 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">👥 Manage Users</h2>
        <button onClick={loadUsers} className="btn btn-outline-primary btn-sm">
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="d-flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, username, or email..."
          style={{ maxWidth: "300px" }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="form-select"
          style={{ maxWidth: "200px" }}
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="ALL">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="OFFICER">Officer</option>
          <option value="CITIZEN">Citizen</option>
        </select>
      </div>

      {/* Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border text-primary"
                role="status"
                style={{ width: "3rem", height: "3rem" }}
              ></div>
              <p className="mt-3 text-muted">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center py-5 text-muted mb-0">
              No users found matching your criteria.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-primary text-white">
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.fullName}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            user.role === "ADMIN"
                              ? "bg-danger"
                              : user.role === "OFFICER"
                              ? "bg-warning text-dark"
                              : "bg-success"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setSelectedUser(user)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* User Modal */}
      {selectedUser && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  👤 {selectedUser.fullName || "User Details"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedUser(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>ID:</strong> {selectedUser.id}
                </p>
                <p>
                  <strong>Username:</strong> {selectedUser.username}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Role:</strong>{" "}
                  <span
                    className={`badge ${
                      selectedUser.role === "ADMIN"
                        ? "bg-danger"
                        : selectedUser.role === "OFFICER"
                        ? "bg-warning text-dark"
                        : "bg-success"
                    }`}
                  >
                    {selectedUser.role}
                  </span>
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedUser(null)}
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
