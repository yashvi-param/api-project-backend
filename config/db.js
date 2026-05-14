import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("Database Connected");
  } catch (error) {
    throw new Error("mongodb connection failed", error.message);
  }
}

export default connectDB;
