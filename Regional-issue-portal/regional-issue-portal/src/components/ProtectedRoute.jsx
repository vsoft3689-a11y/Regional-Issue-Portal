import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAuthData } from "../services/authService";

export default function ProtectedRoute({ children, allowedRoles = [], redirectTo = "/" }) {
  const [isChecking, setIsChecking] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    
    const authUser = getAuthData();
    setUser(authUser);
    setIsChecking(false);
  }, []);

  if (isChecking) {
    
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="text-muted">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
   
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
   
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light text-center">
        <h2 className="text-danger fw-bold mb-3">🚫 Access Denied</h2>
        <p className="text-muted mb-4">
          You do not have permission to view this page.
        </p>
        <a href="/" className="btn btn-primary">
          Go to Home
        </a>
      </div>
    );
  }

  return children;
}
