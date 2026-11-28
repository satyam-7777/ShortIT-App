const express = require("express");
const {
  shortenUrl,
  sendOriginalUrl,
  getMyUrls,
  deleteShortUrl,
  updateShortUrl,
} = require("../controllers/shortUrlController");
const { validateUrl } = require("../middlewares/validateUrl");
const { authenticate, optionalAuthenticate } = require("../controllers/authController");

const router = express.Router();

router.post("/", optionalAuthenticate, validateUrl, shortenUrl);
router.get("/my-urls", authenticate, getMyUrls);
router.get("/:id", sendOriginalUrl);
router.delete("/:id", authenticate, deleteShortUrl);
router.patch("/:id", authenticate, validateUrl, updateShortUrl);

module.exports = router;
