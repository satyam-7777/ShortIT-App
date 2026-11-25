import { useState } from "react";
import { Link2, ArrowRight, Copy } from "lucide-react";
import Error from "../Error/Error";
import "./UrlShortenerCard.css";

export default function UrlShortenerCard({ onUrlShortened }) {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleShortenUrl(e) {
    e.preventDefault();

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setShortenedUrl(null);

      const response = await fetch("/url", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.message || "Unable to shorten URL");
        return;
      }

      setShortenedUrl(data);
      setUrl("");
      setLoading(false);

      if (onUrlShortened) {
        await onUrlShortened();
      }
    } catch (err) {
      console.error("Request failed:", err);
      setError("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shortenedUrl.shortUrlLink);
    } catch (err) {
      setError("Unable to copy URL");
    }
  }

  return (
    <div className="url-shortener-card">
      <div className="url-card-header">
        <div className="url-card-icon">
          <Link2 size={22} />
        </div>
        <div>
          <h2>Shorten your URL</h2>
          <p>Paste your long URL below</p>
        </div>
      </div>

      <form className="url-input-container" onSubmit={handleShortenUrl}>
        <input
          type="url"
          placeholder="https://example.com/your-long-url"
          aria-label="Enter a URL to shorten"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError("");
            setShortenedUrl(null);
          }}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Shortening..." : "Shorten URL"}
          <ArrowRight size={17} />
        </button>
      </form>

      {error && <Error message={error} />}

      {shortenedUrl && (
        <div className="shortened-url-result">
          <p>Your shortened URL</p>
          <a href={shortenedUrl.shortUrlLink} target="_blank" rel="noreferrer">
            {shortenedUrl.shortUrlLink}
          </a>
          <button type="button" aria-label="Copy URL" onClick={handleCopy}>
            <Copy size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
