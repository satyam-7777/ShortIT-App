import { Copy, ExternalLink } from "lucide-react";
import Error from "../Error/Error";
import "./UrlList.css";

export default function UrlList({ urls, loading, error }) {
  async function handleCopy(shortUrl) {
    try {
      await navigator.clipboard.writeText(shortUrl);
    } catch (error) {
      console.error("Unable to copy URL:", error);
    }
  }

  if (loading) return <p>Loading URLs...</p>;
  if (error) return <Error message={error} />;

  return (
    <div className="url-list-container">
      <h2>Your URLs</h2>

      <div className="url-list-content">
        {urls.length === 0 ? (
          <p>No URLs created yet.</p>
        ) : (
          urls.map((url) => {
            const shortUrl = `${window.location.origin}/api/v1/urls/${url.short_url}`;

            return (
              <div className="url-item" key={url._id}>
                <div className="url-details">
                  <a href={shortUrl} target="_blank" rel="noreferrer">
                    {shortUrl}
                  </a>

                  <p>{url.original_url}</p>
                </div>

                <div className="url-activity">
                  <button type="button" aria-label="Copy URL" onClick={() => handleCopy(shortUrl)}>
                    <Copy size={18} />
                  </button>

                  <a
                    href={url.original_url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Open original URL"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
