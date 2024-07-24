const mongoose = require('mongoose'); // Import mongoose

// Connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL); // Connection string from environment variables
        console.log(`MongoDB Connected: ${conn.connection.host}`); // Success message
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`); // Error message
        process.exit(1); // Exit on failure
    }
};

module.exports = connectDB;