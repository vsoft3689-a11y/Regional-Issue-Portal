import "bootstrap/dist/css/bootstrap.min.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-light border-top mt-auto py-3 shadow-sm">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        {/* Left Section */}
        <p className="mb-2 mb-md-0 text-muted small">
           {year} <strong></strong> 
        </p>

        {/* Center Links */}
        <ul className="nav justify-content-center mb-2 mb-md-0">
          <li className="nav-item">
            <a href="/" className="nav-link px-2 text-muted small">
              Home
            </a>
          </li>
          <li className="nav-item">
            <a href="/contact" className="nav-link px-2 text-muted small">
              Contact
            </a>
          </li>
          <li className="nav-item">
            <a href="/privacy" className="nav-link px-2 text-muted small">
              Privacy
            </a>
          </li>
        </ul>

        {/* Right Section — Social Icons */}
        <div className="d-flex gap-3">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted"
          >
            <i className="bi bi-facebook"></i>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted"
          >
            <i className="bi bi-twitter"></i>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted"
          >
            <i className="bi bi-linkedin"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
