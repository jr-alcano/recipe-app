const express = require("express");
const app = require('./app');
const path = require("path");

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "client", "build");
  app.use(express.static(clientPath));

  app.get("/*", (req, res) => {
    if (req.accepts("html")) {
      res.sendFile(path.join(clientPath, "index.html"));
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
}



console.log("Attempting to start server...");
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
