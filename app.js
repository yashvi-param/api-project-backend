import express from "express";
import helmet from "helmet";

import HttpError from "./middleware/HttpError.js";
import connectDB from "./config/db.js";

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const app = express();

app.use(express.json());
app.use(helmet());

app.get("/", (req, res) => {
  res.status(200).json("Hello from server 🚀");
});

app.use((req, res, next) => {
  next(new HttpError("Requested routes not found", 404));
});

app.use((error, req, res, next) => {
  if (req.headerSent) {
    return next(error);
  }

  res
    .status(error.statusCode || 500)
    .json({ message: error.message || "Internal server error" });
});

async function startServer() {
  try {
    await connectDB();

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}

startServer();
