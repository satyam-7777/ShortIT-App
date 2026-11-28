const globalErrorHandler = (err, req, res, next) => {
  // console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let status = err.status || "error";
  let message = err.message || "Something went wrong";

  console.log("it ran");

  if (err.name === "ValidationError") {
    statusCode = 400;
    status = "failed";
  }

  return res.status(statusCode).json({
    status,
    message,
  });
};

module.exports = globalErrorHandler;
