const dns = require("dns").promises;
const AppError = require("../utils/appError");

const validateUrl = async (req, res, next) => {
  const url = req.body?.url?.trim();

  if (!url) {
    return next(new AppError("Please provide a URL", 400));
  }

  try {
    const parsedUrl = new URL(url);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Invalid URL");
    }

    if (!parsedUrl.hostname) {
      throw new Error("Invalid URL");
    }

    await dns.lookup(parsedUrl.hostname);

    req.body.url = url;

    return next();
  } catch (err) {
    return next(new AppError("Invalid URL", 400));
  }
};

module.exports = { validateUrl };
