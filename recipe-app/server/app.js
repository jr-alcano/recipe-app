// server/app.js

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth");
const recipeRoutes = require("./routes/recipes");
const { authenticateJWT } = require("./middleware/auth");

const app = express();

// Set up dynamic CORS origin
const CLIENT_ORIGIN = process.env.NODE_ENV === "production"
  ? "https://<your-client-service>.up.railway.app" //replace
  : "http://localhost:3000";

app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true
}));

app.use(express.json());
app.use(morgan("dev"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/recipes", recipeRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API is working" });
});

module.exports = app;
