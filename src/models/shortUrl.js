const mongoose = require("mongoose");

const shortUrlSchema = new mongoose.Schema(
  {
    original_url: {
      type: String,
      required: [true, "Original URL is required"],
      trim: true,
    },
    short_url: {
      type: String,
      required: [true, "Short URL is required"],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

const shortUrl = mongoose.model("shorturl", shortUrlSchema);

module.exports = shortUrl;
