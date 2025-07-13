const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoConnection = require("./helps/dbConfig");

const authRoutes = require("./routes/auth");
const channelRoutes = require("./routes/channels");
const videoRoutes = require("./routes/videos");
const uploadRoutes = require("./routes/uploads");
const commentRoutes = require("./routes/comments");

const app = express();
dotenv.config();

const PORT = process.env.SERVER_PORT || 5001;

app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use(express.static("assets"));
app.use("/api/medias/banners", express.static(__dirname + "/assets/banners"));
app.use("/api/medias/profiles", express.static(__dirname + "/assets/profiles"));
app.use("/api/medias/covers", express.static(__dirname + "/assets/covers"));
app.use("/api/medias/videos", express.static(__dirname + "/assets/videos"));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/comments", commentRoutes);

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      error: 'Validation Error',
      details: errors
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      error: 'Duplicate entry',
      details: 'Resource already exists'
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired'
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Server is listening on Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  mongoConnection();
});
