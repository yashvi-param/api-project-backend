

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
      console.log(Server running on port ${port});
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}

startServer(); give me its readme file
README.md
# Node.js Express Server Setup 🚀

This project is a basic Express.js server with:

- Express.js
- Helmet security middleware
- MongoDB connection
- Custom error handling
- Environment variables using dotenv

---

# 📦 Installation

## 1. Clone Project

```bash
git clone <your-repository-url>
2. Move into Project Folder
cd project-name
3. Install Dependencies
npm install
📚 Required Packages

Install these packages if not installed:

npm install express helmet dotenv mongoose

If using nodemon:

npm install --save-dev nodemon
📁 Project Structure
project/
│
├── config/
│   └── db.js
│
├── middleware/
│   └── HttpError.js
│
├── .env
├── package.json
├── app.js
└── README.md
⚙️ Environment Variables

Create a .env file in root folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string

Example:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mydatabase
🛢 Database Connection
config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;
❌ Custom Error Middleware
middleware/HttpError.js
class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
  }
}

export default HttpError;
▶️ Run Server
Development Mode
npm run dev
Production Mode
npm start
📝 Package.json Scripts
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}
🌐 API Endpoint
Home Route
Request
GET /
Response
"Hello from server 🚀"
⚠️ Error Handling

If route is not found:

{
  "message": "Requested routes not found"
}
🔒 Helmet Middleware

Helmet helps secure Express apps by setting various HTTP headers.

app.use(helmet());
🚀 Features
Secure Express server
MongoDB integration
Environment variable support
Centralized error handling
Clean project structure
🛠 Technologies Used
Node.js
Express.js
MongoDB
Mongoose
Helmet
Dotenv
