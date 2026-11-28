const formatShortUrlResponse = (req, dbResponse) => {
  const { original_url, short_url, createdAt, updatedAt, _id } = dbResponse;

  const host = `${req.protocol}://${req.get("host")}`;
  const shortUrl = `${host}${req.baseUrl}/${short_url}`;

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "short",
        })
      : null;

  return {
    _id,
    original_url,
    short_url,
    shortUrlLink: shortUrl,
    createdDate: formatDate(createdAt),
    updatedDate: formatDate(updatedAt),
  };
};

module.exports = { formatShortUrlResponse };
