// middleware/auth.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET || "secret";

// Middleware to verify JWT and store user info in res.locals 
function authenticateJWT(req, res, next) {
  const authHeader = req.headers && req.headers.authorization;

  if (authHeader) {
    const token = authHeader.replace(/^[Bb]earer /, "").trim();
    try {
      const payload = jwt.verify(token, SECRET_KEY);
      res.locals.user = payload;
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  return next();
}

// Middleware to ensure user is logged in 
function ensureLoggedIn(req, res, next) {
  if (!res.locals.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return next();
}

module.exports = { authenticateJWT, ensureLoggedIn };
