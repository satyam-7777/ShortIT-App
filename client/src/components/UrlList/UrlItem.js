import { useState } from "react";
import UrlActions from "./UrlActions";
import EditUrlForm from "./EditUrlForm";

export default function UrlItem({
  url,
  onDelete,
  onEdit,
  deletingUrlId,
  savingUrlId,
  deleteError,
  editError,
  setEditError,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUrl, setEditedUrl] = useState(url.original_url);

  const handleSave = async () => {
    const success = await onEdit(url._id, editedUrl);

    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedUrl(url.original_url);
    setEditError("");
    setIsEditing(false);
  };

  const handleCopy = async (shortUrl) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  const shortUrl = url.shortUrlLink;
  const isDeleting = deletingUrlId === url._id;
  const isSaving = savingUrlId === url._id;

  return (
    <div className="url-item">
      <div className="url-details">
        {isEditing ? (
          <EditUrlForm
            value={editedUrl}
            onChange={setEditedUrl}
            onSubmit={handleSave}
            onCancel={handleCancel}
            error={editError}
            saving={isSaving}
            actions={
              <UrlActions
                shortUrl={shortUrl}
                originalUrl={url.original_url}
                onCopy={handleCopy}
                onEdit={() => setIsEditing(true)}
                onDelete={() => onDelete(url._id)}
                deleting={isDeleting}
              />
            }
          />
        ) : (
          <>
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">
              {shortUrl}
            </a>

            <p>{url.original_url}</p>
          </>
        )}

        {deleteError && deletingUrlId === url._id && <p className="error-message">{deleteError}</p>}
      </div>

      {!isEditing && (
        <UrlActions
          shortUrl={shortUrl}
          originalUrl={url.original_url}
          onCopy={handleCopy}
          onEdit={() => {
            setEditedUrl(url.original_url);
            setIsEditing(true);
          }}
          onDelete={() => onDelete(url._id)}
          deleting={isDeleting}
        />
      )}
    </div>
  );
}
