const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const corsOptions = require("./middleware/corsOptions");
const statesRouter = require("./routes/states");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3500;

// Import middleware and controllers
const verifyStates = require("./middleware/verifyStates");
const statesController = require("./controllers/statesController");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/states", statesRouter);
statesRouter.get("/:state", verifyStates, statesController.getState);
statesRouter.get("/:state/funfact", verifyStates, statesController.getFunFact); // Add this route

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Root endpoint
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 404 handler
app.use((req, res) => {
  if (req.accepts("html")) {
    res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
  } else if (req.accepts("json")) {
    res.status(404).json({ error: "404 Not Found" });
  } else {
    res.status(404).type("txt").send("404 Not Found");
  }
});

// Connect to MongoDB
mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
