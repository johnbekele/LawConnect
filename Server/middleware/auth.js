import jwt from "jsonwebtoken";
import userModel from "../models/user.js"; 

const isLoggedIn = async (req, res, next) => {
  console.log("🔍 Checking authentication...");
  console.log("🔍 Cookies:", req.cookies);
  console.log("🔍 Headers:", req.headers);

  const token =
    req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("❌ No token found in cookies or headers");
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id); // or decoded._id

    if (!user) {
      console.log("❌ No user found for decoded token");
      return res.status(401).json({ error: "Unauthorized: Invalid user" });
    }

    req.user = user; // ✅ now req.user is the actual user document
    console.log("✅ Authenticated User:", req.user.email);
    next();
  } catch (error) {
    console.log("❌ Token verification failed:", error.message);
    return res.status(403).json({ error: "Forbidden: Invalid token" });
  }
};

export default isLoggedIn;
