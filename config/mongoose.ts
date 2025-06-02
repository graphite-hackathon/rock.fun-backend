import mongoose from "mongoose";
import { config } from "./index"

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    console.log("=> using existing database connection");
    return;
  }

  console.log("=> using new database connection");
  try {
    await mongoose.connect(config.mongoUrl);
    isConnected = true;
    console.log("MongoDB Connected...");

    // Optional: Add listeners for connection events
    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err}`);
      isConnected = false; // Reset connection status on error
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected.");
      isConnected = false;
    });
  } catch (err: any) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    // Exit process with failure if initial connection fails
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log("MongoDB Disconnected.");
  }
};

// No need to export db directly, models will use the global mongoose connection
