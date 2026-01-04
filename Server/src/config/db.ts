// mongodb connection
import mongoose from "mongoose";
import config from "./_Config";
const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGODB_URL);
        console.log("MongoDB connected successfully");
    }   
    catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};
export default connectDB;