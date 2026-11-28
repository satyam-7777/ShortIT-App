import { useEffect, useState } from "react";
import UrlShortenerCard from "../UrlShortnerCard/UrlShortenerCard";
import UrlList from "../UrlList/UrlList";
import { useAuth } from "../../context/authContext";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [urlsError, setUrlsError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingUrlId, setDeletingUrlId] = useState(null);
  const [editError, setEditError] = useState("");

  async function getUrls() {
    try {
      setUrlsError("");

      const response = await fetch("/url/my-urls", {
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

  async function handleDeleteUrl(urlId) {
    try {
      setDeletingUrlId(urlId);
      setDeleteError("");

      const response = await fetch(`/url/${urlId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete URL");
      }

      setUrls((prev) => prev.filter((url) => url._id !== urlId));
    } catch (error) {
      setDeleteError(error.message);
    } finally {
      setDeletingUrlId(null);
    }
  }

  async function handleEditUrl(urlId, originalUrl) {
    try {
      setEditError("");

      const response = await fetch(`/url/${urlId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          url: originalUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update URL");
      }

      setUrls((prev) =>
        prev.map((url) => (url._id === urlId ? { ...url, original_url: originalUrl } : url)),
      );

      return true;
    } catch (error) {
      setEditError(error.message);
      return false;
    }
  }

  useEffect(() => {
    getUrls();
  }, []);

  return (
    <div className="dashboard">
      <main className="dashboard-main">
        <section className="welcome-section">
          <h1>Welcome, {user?.name}!</h1>
          <p>Ready to shorten some links?</p>
        </section>

        <section className="dashboard-shortener-section">
          <UrlShortenerCard onUrlShortened={getUrls} />
        </section>

        <section className="url-list-section">
          <UrlList
            urls={urls}
            loading={loading}
            error={urlsError}
            onDelete={handleDeleteUrl}
            onEdit={handleEditUrl}
            deletingUrlId={deletingUrlId}
            deleteError={deleteError}
            editError={editError}
            setEditError={setEditError}
          />
        </section>
      </main>
    </div>
  );
}
