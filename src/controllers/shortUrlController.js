const { nanoid } = require("nanoid");
const shortUrl = require("../models/ShortUrl");
const { formatShortUrlResponse } = require("../utils/utils");
const {
  getCachedOriginalUrl,
  cacheOriginalUrl,
  invalidateOriginalUrl,
} = require("../utils/urlCache");
const AppError = require("../utils/appError");

const shortenUrl = async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      throw new AppError("Please provide a URL", 400);
    }

    const userId = req.user?._id || null;

    let urlData = await shortUrl.findOne({
      original_url: url,
      user: userId,
    });

    let statusCode = 200;

    if (!urlData) {
      const maxAttempts = process.env.SHORT_URL_ATTEMPT;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const shortUrlKey = nanoid(Number(process.env.SHORT_URL_LENGTH) || 10);

        try {
          urlData = await shortUrl.create({
            original_url: url,
            short_url: shortUrlKey,
            user: userId,
          });

          statusCode = 201;
          break;
        } catch (err) {
          const isDuplicateShortCodeErr = err.code === 11000 && err.keyPattern?.short_url;

          if (!isDuplicateShortCodeErr) {
            throw err;
          }

          if (attempt === maxAttempts) {
            throw new AppError("Unable to generate a unique short URL. Please try again.", 500);
          }
        }
      }
    }

    return res.status(statusCode).json(formatShortUrlResponse(req, urlData));
  } catch (err) {
    return next(err);
  }
};

const sendOriginalUrl = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || id.length !== Number(process.env.SHORT_URL_LENGTH)) {
      throw new AppError("Invalid Short URL", 400);
    }

    // 1. Check Redis cache
    const cachedOriginalUrl = await getCachedOriginalUrl(id);

    if (cachedOriginalUrl) {
      console.log("Redis cache HIT");

      return res.redirect(cachedOriginalUrl);
    }

    console.log("Redis cache MISS");

    // 2. Cache miss: find URL in MongoDB
    const existingUrlData = await shortUrl.findOne({
      short_url: id,
    });

    if (!existingUrlData) {
      throw new AppError("Invalid Short URL", 404);
    }

    // 3. Store original URL in Redis
    await cacheOriginalUrl(id, existingUrlData.original_url);

    // 4. Redirect to original URL
    return res.redirect(existingUrlData.original_url);
  } catch (err) {
    return next(err);
  }
};

const getMyUrls = async (req, res, next) => {
  try {
    const userId = req.user?._id || null;

    const urls = await shortUrl
      .find({
        user: userId,
      })
      .sort({ createdAt: -1 });

    const formattedUrls = urls.map((url) => formatShortUrlResponse(req, url));

    return res.status(200).json({
      status: "success",
      results: formattedUrls.length,
      data: {
        urls: formattedUrls,
      },
    });
  } catch (err) {
    next(err);
  }
};

const deleteShortUrl = async (req, res, next) => {
  try {
    const userId = req.user?._id || null;
    const { id } = req.params;

    const url = await shortUrl.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!url) {
      return next(new AppError("URL not found", 404));
    }

    // Invalidate Redis cache
    await invalidateOriginalUrl(url.short_url);

    res.status(200).json({
      status: "success",
      message: "Short URL deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateShortUrl = async (req, res, next) => {
  try {
    const { url } = req.body;
    const { id } = req.params;

    if (!url) {
      throw new AppError("Please provide a URL", 400);
    }

    // Check if the URL already exists for this user
    const existingUrl = await shortUrl.findOne({
      original_url: url,
      user: req.user._id,
      _id: { $ne: id },
    });

    if (existingUrl) {
      throw new AppError("This URL already exists in your account.", 409);
    }

    const updatedUrl = await shortUrl.findOneAndUpdate(
      {
        _id: id,
        user: req.user._id,
      },
      {
        original_url: url,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updatedUrl) {
      throw new AppError("URL not found", 404);
    }

    await invalidateOriginalUrl(updatedUrl.short_url);

    return res.status(200).json({
      status: "success",
      message: "Short URL updated successfully",
      data: {
        url: updatedUrl,
      },
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { shortenUrl, sendOriginalUrl, getMyUrls, deleteShortUrl, updateShortUrl };
