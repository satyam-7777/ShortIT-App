import Error from "../Error/Error";

export default function EditUrlForm({
  value,
  onChange,
  onSubmit,
  onCancel,
  error,
  saving,
  actions,
}) {
  return (
    <form
      className="edit-container"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="edit-input-row">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com"
          required
        />

        {actions}
      </div>

      {error && <Error message={error} />}

      <div className="edit-actions">
        <button type="button" onClick={onCancel} disabled={saving}>
          Cancel
        </button>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
