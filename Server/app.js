import 'dotenv/config.js'; // For ES Modules, typically use this for dotenv config
import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
import connectDB from "./config/db.js"; 

// Import routes as ES Modules
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import caseRoutes from './routes/caseRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import feeRoutes from './routes/feeRoutes.js';

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
       "http://localhost:3000",
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


export default app;
