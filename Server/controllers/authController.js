// authRoutes.js

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.js';
import otpModel from '../models/otpModel.js';
import { sendOTP as sendOTPEmail } from '../utils/emailService.js';
import dotenv from 'dotenv';

dotenv.config();

// Define common cookie options for consistency and environment
const getCookieOptions = (isProduction) => ({
  httpOnly: true,
  // 'secure' must be true for SameSite='None' in production (HTTPS)
  // For local HTTP development, 'secure' should be false.
  secure: isProduction,
  // 'SameSite=None' allows cross-site cookies but requires 'secure: true'
  // 'SameSite=Lax' is a good default for same-site or safe cross-site navigation, but can be strict for XHR
  // For cross-origin localhost (e.g., 5173 to 3000), 'Lax' should generally work, but 'None' with secure:false is often used as a dev workaround if 'Lax' is problematic.
  // We'll stick to Lax for dev and None for prod with secure:true.
  sameSite: isProduction ? "None" : "Lax", // Or "None" if 'Lax' still fails on localhost, but then need to consider 'secure:false' implications.
  maxAge: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
});



export const register = async (req, res) => {
  try {
    const { name, age, email, password, secretString } = req.body;

    if (!name || !email || !password || !age || !secretString) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // IMPORTANT: Secret string should also be hashed before storing!
    const hashedSecretString = await bcrypt.hash(secretString, salt); // Hash secret string

    const user = await userModel.create({
      name,
      age,
      email,
      password: hashedPassword,
      secretString: hashedSecretString // Store hashed secret string
    });

    const token = jwt.sign(
      { email: user.email, userid: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Token expires in 1 day
    );

    // Set the cookie with proper options
    res.cookie("token", token, getCookieOptions(process.env.NODE_ENV === "production"));
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({ message: "User with this email already exists" });
    }
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Token expires in 1 day
    );

    // Set the cookie with proper options
    res.cookie("token", token, getCookieOptions(process.env.NODE_ENV === "production"));

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendOTP = async (req, res) => {
  try {
    const { name, email, age } = req.body;

    if (!name || !email || !age) {
      return res.status(400).json({ message: "Name, email, and age are required." });
    }

    // Check if user already exists (prevent sending OTP if already registered)
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists. Please login." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    await sendOTPEmail(email, otp);
    // Overwrite existing OTP for this email, or create new.
    // Adds `createdAt` to allow for TTL/expiration on OTPs later.
    await otpModel.findOneAndUpdate(
      { email },
      { otp, type: 'email', createdAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body; // 'name' and 'age' are not needed for OTP verification

    const otpEntry = await otpModel.findOne({ email });
    if (!otpEntry) {
      return res.status(404).json({ message: "OTP not found or expired. Please request a new one." });
    }

    // Convert stored OTP to number for strict comparison if it's stored as string
    if (otpEntry.otp === parseInt(otp, 10)) {
      await otpModel.deleteOne({ email }); // Delete OTP after successful verification

      // IMPORTANT: DO NOT create the user here if `register` is the final step
      // The user is only persisted to DB with password in the `register` endpoint.
      res.status(200).json({ message: "OTP verified successfully. You can now complete your registration." });
    } else {
      res.status(400).json({ message: "Incorrect OTP. Please try again." });
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

export const logout = (req, res) => {
  // Clear the token cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
  });
  res.json({ message: "Logged out successfully" });
};

export const verifyExisting = async (req, res) => {
  try {
    const { email, secretString } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // IMPORTANT: Secret string must be hashed and compared.
    // Assuming `user.secretString` is hashed, compare with hashed `secretString` from request.
    const match = await bcrypt.compare(secretString, user.secretString);
    if (!match) {
      return res.status(401).json({ message: "Incorrect secret phrase" });
    }

    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    console.error("Verification existing error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyToken = (req, res) => {
  // This endpoint is typically for client-side token validation (e.g., on app load)
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    console.error("Token verification failed (verifyToken endpoint):", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, secretString } = req.body;

    if (!email || !secretString) {
      return res.status(400).json({ message: "Email and new password are required." });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(secretString, salt);
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password" });
  }
};