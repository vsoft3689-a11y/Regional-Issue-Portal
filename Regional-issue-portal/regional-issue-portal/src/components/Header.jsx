import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuthData, logout } from "../services/authService";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Header() {
  const user = getAuthData();
  const navigate = useNavigate();
  const location = useLocation();
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const publicPaths = [
    "/", "/login", "/login-citizen",
    "/login-officer", "/login-admin",
    "/register-citizen"
  ];

  if (publicPaths.includes(location.pathname)) return null;
  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* Smaller Logout Floating Button */}
      <div
        style={{
          position: "fixed",
          top: "15px",
          right: "15px",
          zIndex: 2000,
        }}
      >
        <button className="logout-circle-btn-small" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <style>
        {`
          .logout-circle-btn-small {
            width: 55px;
            height: 55px;
            border-radius: 50%;
            border: none;
            background: linear-gradient(135deg, #ff4b4b, #c91d1d);
            color: white;
            font-weight: 700;
            font-size: 11px;
            letter-spacing: 0.5px;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(255, 77, 77, 0.4);
            transition: all 0.25s ease;
            display: flex;
            justify-content: center;
            align-items: center;
            text-transform: uppercase;
            user-select: none;
          }

          .logout-circle-btn-small:hover {
            transform: scale(1.10);
            box-shadow: 0 6px 18px rgba(255, 66, 66, 0.45);
          }

          .logout-circle-btn-small:active {
            transform: scale(0.90);
          }
        `}
      </style>
    </>
  );
}
