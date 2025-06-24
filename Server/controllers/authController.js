const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const otpModel = require('../models/otpModel');
const emailService = require('../utils/emailService');

class AuthController {
  static async register(req, res) {
    try {
      const { name, age, email, password, secretString } = req.body;
      
      if (!name || !email || !password || !age || !secretString) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Remove existing user if any
      await userModel.deleteOne({ email });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = await userModel.create({
        name,
        age,
        email,
        password: hashedPassword,
        secretString
      });

      // Generate token
      const token = jwt.sign(
        { email: email, userid: user._id }, 
        process.env.JWT_SECRET
      );

      res.cookie("token", token);
      res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: "User already registered" });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Error creating user" });
    }
  }

  static async login(req, res) {
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
        { expiresIn: "1h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none"
      });

      res.json({ message: "Login successful", token });
    } catch (error) {
      console.error("Login error:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async sendOTP(req, res) {
    try {
      const { name, email, age } = req.body;
      
      if (!name || !email || !age) {
        return res.status(400).json({ message: "Name, email, and age are required." });
      }

      const otp = Math.floor(100000 + Math.random() * 900000);
      
      await emailService.sendOTP(email, otp);
      await otpModel.create({ email, otp, type: 'email' });
      
      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ message: "Error sending OTP" });
    }
  }

  static async verifyOTP(req, res) {
    try {
      const { name, email, age, otp } = req.body;

      const otpEntry = await otpModel.findOne({ email });
      if (!otpEntry) {
        return res.status(404).json({ message: "OTP not found or expired" });
      }

      if (otpEntry.otp === parseInt(otp, 10)) {
        await userModel.create({ name, email, age });
        await otpModel.deleteOne({ email });
        res.status(200).json({ message: "User created successfully" });
      } else {
        res.status(400).json({ message: "Incorrect OTP" });
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(500).json({ message: "Error verifying OTP" });
    }
  }

  static async logout(req, res) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });
    res.json({ message: "Logged out successfully" });
  }

  static async verifyExisting(req, res) {
    try {
      const { email, secretString } = req.body;

      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Email not found" });
      }

      if (user.secretString !== secretString) {
        return res.status(401).json({ message: "Incorrect secret key" });
      }

      res.status(200).json({ message: "Verification successful" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async verifyToken(req, res) {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.json({ valid: true, user: decoded });
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  }
}

module.exports = AuthController;