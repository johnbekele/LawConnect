const mongoose = require("mongoose");

// const MONGO_URI = "mongodb+srv://swayamsam2005:sLDNreRmb5R0KjQH@cluster0.ipxl289.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
 const MONGO_URI = "mongodb+srv://devyani:ExGFcHfjLVZueYBc@cluster0.1ubgspy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
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
