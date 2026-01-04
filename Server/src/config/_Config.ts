// Write Config
import dotenv from "dotenv";
dotenv.config()
// object destructuring
const { PORT, MONGODB_URL, JWT_SECRET } = process.env;


const config = {
    PORT: PORT || 5000,
    MONGODB_URL: MONGODB_URL || "mongodb://localhost:27017/airbnb_clone",
    JWT_SECRET: JWT_SECRET || "your_jwt_secret_key",
};
export default config;

// freeze the config object to prevent modifications
Object.freeze(config);