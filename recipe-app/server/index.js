// server/index.js

const express = require("express");
const app = require("./app");

const PORT = process.env.PORT || 3001;

// Log any uncaught exceptions or unhandled rejections
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
  console.error(err.stack);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("🔥 Unhandled Rejection:", reason);
});

console.log("Attempting to start server...");
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
