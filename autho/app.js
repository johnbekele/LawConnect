require("dotenv").config();
const express = require('express');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const connectDB = require("./config/db");

// Import routes
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const caseRoutes = require('./routes/caseRoutes.js');
const clientRoutes = require('./routes/clientRoutes.js');
const feeRoutes = require('./routes/feeRoutes.js');

const app = express();

// Connect to MongoDB
connectDB();

// Trust proxy
app.set("trust proxy", 1);

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://lawconnect-wxr0.onrender.com",
        "positive-liberal-treefrog.ngrok-free.app",
        "personally-allowing-lacewing.ngrok-free.app",
        "http://localhost:5173",
        "https://law-connect-lilac.vercel.app"
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/fees', feeRoutes);

// Legacy routes (for backward compatibility)
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', caseRoutes);
app.use('/', clientRoutes);
app.use('/', feeRoutes);

module.exports = app;