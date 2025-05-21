// server/app.js

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const authRoutes = require("./routes/auth");
const recipeRoutes = require("./routes/recipes");
const { authenticateJWT } = require("./middleware/auth");

const app = express();

// Set up dynamic CORS origin
const corsOptions = {
  origin: process.env.NODE_ENV === "production"
    ? true 
    : "http://localhost:3000",
  credentials: true
};

app.use(cors(corsOptions));
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

// Serve React frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}

module.exports = app;
