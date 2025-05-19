// server/index.js

const express = require("express");
const app = require("./app");

const PORT = process.env.PORT || 3001;

console.log("Attempting to start server...");
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
