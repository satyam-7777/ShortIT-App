const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

const authRouter = require("./src/routes/authRouter");
const shortUrlRouter = require("./src/routes/shortUrlRouter");

const AppError = require("./src/utils/appError");
const globalErrorHandler = require("./src/utils/errorHandler");

// Create Express app
const app = express();

// Global middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Request logger
app.use(morgan("dev"));

// API routes
app.use("/api/v1/auth", authRouter);
app.use("/url", shortUrlRouter);

// Serve React frontend
// app.use(express.static(path.join(__dirname, "client", "build")));

// app.get("/{*splat}", (req, res) => {
//   res.sendFile(path.join(__dirname, "client", "build", "index.html"));
// });

// Handle undefined API routes
// app.use((req, res, next) => {
//   next(new AppError("Requested URL is not available on the server", 404));
// });

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
