import UrlItem from "./UrlItem";
import Error from "../Error/Error";
import "./UrlList.css";

export default function UrlList({
  urls,
  loading,
  error,
  onDelete,
  onEdit,
  deletingUrlId,
  savingUrlId,
  deleteError,
  editError,
  setEditError,
}) {
  if (loading) {
    return <p>Loading URLs...</p>;
  }

  if (error) {
    return <Error message={error} />;
  }

  if (!urls.length) {
    return <p>No URLs created yet.</p>;
  }

  return (
    <div className="url-list-container">
      <div className="url-list-content">
        {urls.map((url) => (
          <UrlItem
            key={url._id}
            url={url}
            onDelete={onDelete}
            onEdit={onEdit}
            deletingUrlId={deletingUrlId}
            savingUrlId={savingUrlId}
            deleteError={deleteError}
            editError={editError}
            setEditError={setEditError}
          />
        ))}
      </div>
    </div>
  );
}
