// server/app.js

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const authRoutes = require("./routes/auth");
const recipeRoutes = require("./routes/recipes");
const { authenticateJWT } = require("./middleware/auth");

const app = express();

const CLIENT_ORIGIN = process.env.NODE_ENV === "production"
  ? "https://recipe-app-seven-dusky.vercel.app"
  : "http://localhost:3000";

app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true
}));

console.log("NODE_ENV:", process.env.NODE_ENV, "CLIENT_ORIGIN:", CLIENT_ORIGIN);

app.use(express.json());
app.use(morgan("dev"));
app.use(authenticateJWT);

// API Routes
app.use("/auth", authRoutes);
app.use("/recipes", recipeRoutes);

// Root API route
app.get("/", (req, res) => {
  res.json({ message: "API is working" });
});


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./client-build")));

  app.get("*", (req, res, next) => {
    try {
      if (req.originalUrl.startsWith("/auth") || req.originalUrl.startsWith("/recipes")) {
        return res.status(404).json({ error: "Not found" });
      }
      res.sendFile(path.join(__dirname, "./client-build", "index.html"));
    } catch (err) {
      next(err); // delegate to Express error handler
    }
  });

}

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Server error" });
});


module.exports = app;
