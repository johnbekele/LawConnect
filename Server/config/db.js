import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config(); // Load environment variables from .env file

const MONGO_URI = process.env.MONGO_URI || "";
console.log("MONGO_URI:", MONGO_URI); // Debugging log to check if MONGO_URI is set
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB Connected...");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1); // Exit process on failure
    }
};

export default connectDB;
