const jwt = require('jsonwebtoken');

const isLoggedIn = (req, res, next) => {
  console.log("🔍 Checking authentication...");
  console.log("🔍 Cookies:", req.cookies);
  console.log("🔍 Headers:", req.headers);

  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("❌ No valid token found in cookies");
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("✅ Decoded User:", req.user);
    next();
  } catch (error) {
    console.log("❌ Token verification failed:", error.message);
    return res.status(403).json({ error: "Forbidden: Invalid token" });
  }
};

module.exports = { isLoggedIn };