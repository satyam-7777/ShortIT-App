const { v4: uuid } = require("uuid");
const shortUrl = require("../models/shortUrl");
const { formatShortUrlResponse } = require("../utils/utils");
const AppError = require("../utils/appError");

const shortenUrl = async (req, res, next) => {
  const { url } = req.body;

  try {
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
      const shortUrlKey = uuid().replace(/-/g, "").slice(0, Number(process.env.SHORT_URL_LENGTH));

      urlData = await shortUrl.create({
        original_url: url,
        short_url: shortUrlKey,
        user: userId,
      });

      statusCode = 201;
    }

    return res.status(statusCode).json(formatShortUrlResponse(req, urlData));
  } catch (err) {
    return next(err);
  }
};

const sendOriginalUrl = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!id || id.length !== Number(process.env.SHORT_URL_LENGTH)) {
      throw new AppError("Invalid Short URL", 400);
    }

    const existingUrlData = await shortUrl.findOne({
      short_url: id,
    });

    if (!existingUrlData) {
      throw new AppError("Invalid Short URL", 404);
    }

    return res.redirect(existingUrlData.original_url);
  } catch (err) {
    return next(err);
  }
};

const getMyUrls = async (req, res, next) => {
  try {
    const urls = await shortUrl
      .find({
        user: req.user._id,
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      results: urls.length,
      data: { urls },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { shortenUrl, sendOriginalUrl, getMyUrls };
