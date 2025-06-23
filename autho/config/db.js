const { configDotenv } = require("dotenv");
const mongoose = require("mongoose");

configDotenv(); // Load environment variables from .env file


const MONGO_URI = process.env.MONGO_URI ;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB Connected...");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1); // Exit process on failure
    }
};

module.exports = connectDB;
