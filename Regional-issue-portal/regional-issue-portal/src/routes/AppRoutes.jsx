import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// Public
import Home from "../pages/Home";
import RegisterCitizen from "../pages/RegisterCitizen";
import LoginCitizen from "../pages/LoginCitizen";
import LoginOfficer from "../pages/LoginOfficer";
import LoginAdmin from "../pages/LoginAdmin";

// Citizen
import DashboardCitizen from "../pages/DashboardCitizen";
import IssueForm from "../pages/IssueForm";

// Officer
import DashboardOfficer from "../pages/DashboardOfficer";
import IssueUpdateOfficer from "../pages/IssueUpdateOfficer";

// Admin
import DashboardAdmin from "../pages/DashboardAdmin";
import AdminIssues from "../pages/AdminIssues";
import AdminUsers from "../pages/AdminUsers";
import AdminDepartments from "../pages/AdminDepartments";
import Reports from "../pages/Reports";

// Shared
import UserProfile from "../pages/UserProfile";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/register-citizen" element={<RegisterCitizen />} />
      <Route path="/login-citizen" element={<LoginCitizen />} />
      <Route path="/login-officer" element={<LoginOfficer />} />
      <Route path="/login-admin" element={<LoginAdmin />} />

      {/* Citizen */}
      <Route
        path="/citizen/dashboard"
        element={
          <ProtectedRoute allowedRoles={["CITIZEN"]}>
            <DashboardCitizen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/report"
        element={
          <ProtectedRoute allowedRoles={["CITIZEN"]}>
            <IssueForm />
          </ProtectedRoute>
        }
      />

      {/* Officer */}
      <Route
        path="/officer/dashboard"
        element={
          <ProtectedRoute allowedRoles={["OFFICER"]}>
            <DashboardOfficer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/issue/:id"
        element={
          <ProtectedRoute allowedRoles={["OFFICER"]}>
            <IssueUpdateOfficer />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <DashboardAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/issues"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminIssues />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/departments"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDepartments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* Shared */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["CITIZEN", "OFFICER", "ADMIN"]}>
            <UserProfile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
