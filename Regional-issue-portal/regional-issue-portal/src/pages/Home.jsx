

import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      {/* 🔹 Top Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold text-uppercase" to="/">
            🌐 Regional Issue Management Portal
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link active" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#services">
                  Services
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* 🔹 Hero Section */}
      <section
        className="text-center text-white d-flex align-items-center justify-content-center flex-column"
        style={{
          background:
            "linear-gradient(135deg, #0d6efd 60%, #007bff 100%)",
          minHeight: "60vh",
          padding: "60px 20px",
        }}
      >
        <h1 className="fw-bold display-5 mb-3">
          Empowering Citizens through Technology
        </h1>
        <p className="lead mb-4 text-light">
          Seamless collaboration between Citizens, Officers, and Administrators for
          transparent and faster issue resolution.
        </p>

        <div className="d-flex flex-wrap justify-content-center gap-3">
          <Link
            to="/register-citizen"
            className="btn btn-warning text-dark fw-semibold px-4 py-2"
          >
            📝 Register as Citizen
          </Link>
          <Link to="/login-citizen" className="btn btn-light fw-semibold px-4 py-2">
            👤 Citizen Login
          </Link>
          <Link to="/login-officer" className="btn btn-success fw-semibold px-4 py-2">
            🛡️ Officer Login
          </Link>
          <Link to="/login-admin" className="btn btn-danger fw-semibold px-4 py-2">
            ⚙️ Admin Login
          </Link>
        </div>
      </section>

      {/* 🔹 Services / Features Section */}
      <section id="services" className="container py-5 text-center">
        <h2 className="fw-bold text-primary mb-4">Citizen Services</h2>
        <p className="text-muted mb-5">
          Our portal enables citizens to report local issues directly to the
          concerned departments and track the progress in real-time.
        </p>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <i className="bi bi-geo-alt text-primary display-5 mb-3"></i>
                <h5 className="fw-bold">Report Local Issues</h5>
                <p className="text-muted small">
                  Easily report civic problems like potholes, drainage, streetlights, and more using our portal.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <i className="bi bi-people text-success display-5 mb-3"></i>
                <h5 className="fw-bold">Officer Coordination</h5>
                <p className="text-muted small">
                  Assigned officers can manage, update, and resolve reported issues efficiently with full transparency.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <i className="bi bi-speedometer2 text-danger display-5 mb-3"></i>
                <h5 className="fw-bold">Admin Monitoring</h5>
                <p className="text-muted small">
                  Real-time dashboards and analytics to track performance, response times, and citizen satisfaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 About Section */}
      <section id="about" className="bg-white py-5 border-top">
        <div className="container text-center">
          <h2 className="fw-bold text-primary mb-4">About the Portal</h2>
          <p className="text-muted mb-4">
            The <strong>Regional Issue Management Portal (RIMP)</strong> is an initiative
            to enhance civic engagement and service delivery through digital platforms.
            Citizens can directly connect with local authorities to ensure timely issue resolution.
          </p>
        </div>
      </section>

      {/* 🔹 Contact Section */}
      <section id="contact" className="py-5 bg-light border-top">
        <div className="container text-center">
          <h2 className="fw-bold text-primary mb-3">Contact Us</h2>
          <p className="text-muted mb-1">
            Need help? Reach out to our support team or regional helpdesk.
          </p>
          <p className="mb-0">
            📧 <a href="mailto:support@rimp.gov.in" className="text-primary">support@rimp.gov.in</a>
          </p>
          <p>📞 1800-425-1234 (Toll-Free)</p>
        </div>
      </section>

      {/* 🔹 Footer */}
      <footer className="bg-dark text-white text-center py-4 mt-auto">
        <p className="mb-1 small">
          © 2025 <strong>Regional Issue Management Portal</strong> | All Rights Reserved
        </p>
        <p className="mb-0 small text-secondary">
          Designed and Developed by <strong>Gorige Dhamodhar</strong>
        </p>
      </footer>
    </div>
  );
}

