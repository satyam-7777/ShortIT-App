import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import UrlShortenerCard from "../UrlShortnerCard/UrlShortenerCard";
import UrlList from "../UrlList/UrlList";
import { useAuth } from "../../context/authContext";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [urlsError, setUrlsError] = useState("");

  async function getUrls() {
    try {
      setUrlsError("");

      const response = await fetch("/api/v1/urls/my-urls", {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch URLs");
      }

      setUrls(data.data.urls);
    } catch (error) {
      setUrlsError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUrls();
  }, []);

  return (
    <div className="dashboard">
      <NavBar />

      <main className="dashboard-main">
        <section className="welcome-section">
          <h1>Welcome, {user?.name}!</h1>
          <p>Ready to shorten some links?</p>
        </section>

        <section className="dashboard-shortener-section">
          <UrlShortenerCard onUrlShortened={getUrls} />
        </section>

        <section className="url-list-section">
          <UrlList urls={urls} loading={loading} error={urlsError} />
        </section>
      </main>
    </div>
  );
}
