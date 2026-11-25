import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import "./NavBar.css";

export default function NavBar() {
  return (
    <nav className="navbar">
      <Logo />
      <NavLinks />
    </nav>
  );
}

export function Logo() {
  return (
    <div className="logo">
      <span className="logo-icon">S</span>
      <Link className="link logo-title" to="/">
        ShortIT
      </Link>
    </div>
  );
}

export function NavLinks() {
  const { user, logoutUser } = useAuth();

  return (
    <div className="nav-links">
      <ul>
        {user ? (
          <>
            <li>
              <Link className="link dashboard-link" to="/dashboard">
                Dashboard
              </Link>
            </li>

            <li>
              <button onClick={logoutUser} className="logout-link">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link className="link login-link" to="/login">
                Login
              </Link>
            </li>

            <li>
              <Link className="link signup-link" to="/signup">
                Signup
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
