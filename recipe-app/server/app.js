// server/app.js

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

console.log("Starting to set up app.js");

const authRoutes = require("./routes/auth");
console.log("Imported authRoutes");

const recipeRoutes = require("./routes/recipes");
console.log("Imported recipeRoutes");

const { authenticateJWT } = require("./middleware/auth");
console.log("Imported authenticateJWT");

const app = express();

const CLIENT_ORIGIN = process.env.NODE_ENV === "production"
  ? "https://recipe-app-seven-dusky.vercel.app"
  : "http://localhost:3000";

console.log("Setting CORS origin:", CLIENT_ORIGIN);

app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true
}));
console.log("CORS middleware added");

app.use(express.json());
console.log("JSON middleware added");

app.use(morgan("dev"));
console.log("Morgan logging added");

app.use(authenticateJWT);
console.log("JWT authentication middleware added");

// API Routes
app.use("/auth", authRoutes);
console.log("/auth routes registered");

app.use("/recipes", recipeRoutes);
console.log("/recipes routes registered");

// Root API route
app.get("/", (req, res) => {
  res.json({ message: "API is working" });
});
console.log("Root route registered");

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Server error" });
});

console.log("Finished setting up app.js");

module.exports = app;
