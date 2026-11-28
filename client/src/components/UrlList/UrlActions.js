import { Copy, ExternalLink, Trash2, Pencil } from "lucide-react";

export default function UrlActions({ shortUrl, originalUrl, onCopy, onEdit, onDelete, deleting }) {
  return (
    <div className="url-activity">
      <button type="button" title="Copy short URL" onClick={() => onCopy(shortUrl)}>
        <Copy size={16} />
      </button>

      <a href={originalUrl} target="_blank" rel="noopener noreferrer" title="Open original URL">
        <ExternalLink size={16} />
      </a>

      <button type="button" title="Edit URL" onClick={onEdit}>
        <Pencil size={16} />
      </button>

      <button type="button" title="Delete URL" onClick={onDelete} disabled={deleting}>
        <Trash2 size={16} />
      </button>
    </div>
  );
}
