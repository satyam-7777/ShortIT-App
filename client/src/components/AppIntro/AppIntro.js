import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../../context/authContext";
import "./AppIntro.css";

export default function AppIntro() {
  const { user } = useAuth();

  return (
    <section className="app-intro-container">
      <div className="app-intro">
        <h1>
          Shorten links.
          <br />
          <span className="intro-text">Amplify reach.</span>
        </h1>

        <p>
          Create short, memorable links and track their performance. Share your links anywhere with
          ShortIT.
        </p>

        {!user && (
          <div className="link-container">
            <Link to="/signup" className="hero-link get-started-btn">
              Get Started
              <ArrowRight size={16} />
            </Link>

            <Link to="/login" className="hero-link sign-in-btn">
              Log In
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
