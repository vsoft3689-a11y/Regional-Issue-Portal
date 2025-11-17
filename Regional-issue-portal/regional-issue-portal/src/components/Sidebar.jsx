import { Link, useLocation } from "react-router-dom";
import { getAuthData } from "../services/authService";

export default function Sidebar() {
  const user = getAuthData();
  const location = useLocation();
  const role = user?.role || "";

  const publicPaths = [
    "/", "/login-citizen", "/login-officer",
    "/login-admin", "/register-citizen"
  ];

  if (publicPaths.includes(location.pathname) || !user || role !== "CITIZEN") {
    return null;
  }

  return (
    <>
      <div className="sidebar-blue">

        {/* 1. My Issues */}
        <Link to="/citizen/dashboard" className="side-btn">
          <span className="num-circle">1</span> My Issues
        </Link>

        {/* 2. Report Issue */}
        <Link to="/citizen/report" className="side-btn">
          <span className="num-circle">2</span> Report Issue
        </Link>

      </div>

      <style>{`
        .sidebar-blue {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 160px;
          background: #0d6efd;
          padding-top: 90px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          z-index: 1100;
        }

        .side-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: white;
          color: #0d6efd;
          padding: 8px 10px;
          width: 130px;
          margin-left: 15px;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          transition: 0.2s ease;
        }

        .side-btn:hover {
          background: #e8eeff;
        }

        .num-circle {
          background: #0d6efd;
          color: white;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0.8rem;
          font-weight: bold;
        }

        /* Push content right */
        body {
          margin-left: 160px !important;
        }
      `}</style>
    </>
  );
}
