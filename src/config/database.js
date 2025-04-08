import mongoose from "mongoose"; // Import Mongoose for MongoDB interactions

// Async function to connect to MongoDB
const connectDB = async () => {
  try {
    // Attempt to connect using the MONGO_URI from environment variables
    await mongoose.connect(process.env.MONGO_URI);

    // Log success message if connection is successful
    console.log("✅ MongoDB Connected");
  } catch (error) {
    // Log error message if connection fails
    console.error("❌ Database connection error:", error.message);

    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB; // Export the connection function for use in other files
