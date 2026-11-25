import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="copyright">© {new Date().getFullYear()} ShortIT. All rights reserved.</p>

        <div className="footer-links">
          <Link to="#">Privacy Policy</Link>
          <Link to="#">Terms of Service</Link>
          <a href="mailto:support@shortit.com">Contact</a>
        </div>
      </div>
    </footer>
  );
}
