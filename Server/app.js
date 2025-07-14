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
import Upload from './routes/Upload.js';


import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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
        "https://lawconnect-79kq.onrender.com",
        "http://localhost:3000",
        "http://localhost:5173",
        " https://law-connect-git-main-yohans-bekeles-projects.vercel.app",
        "https://law-connect-two.vercel.app"
      ];

      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('❌ CORS blocked origin:', origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      "Content-Type", 
      "Authorization", 
      "Cookie",
      "Set-Cookie",
      "Access-Control-Allow-Credentials"
    ],
    exposedHeaders: ["Set-Cookie"]
  })
);

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

console.log('Serving uploads from:', path.join(__dirname, 'uploads'));
app.use('/api/uploads', express.static(path.join(__dirname,  'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/upload', Upload);


export default app;
