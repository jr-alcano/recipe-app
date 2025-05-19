const express = require("express");
const app = require("./app");

const PORT = process.env.PORT || 8080;

console.log("Attempting to start server...");
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
