// app.js
const express = require("express");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
  // You can set up models and other configurations here
});

// Middleware for handling errors
app.use((err, req, res, next) => {
  console.error(err);

  // Check if it's a known error type
  if (err instanceof Error) {
    res.status(500).send(`Internal Server Error: ${err.message}`);
  } else {
    res.status(500).send('Something went wrong!');
  }
});

// Your routes and other configurations go here

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Example route using express-validator and MongoDB
app.post("/users", [
  // Add validation rules as needed
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Example MongoDB interaction
  const User = mongoose.model("User", {
    username: String,
    email: String,
  });

  const newUser = new User(req.body);

  newUser.save((error) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }

    res.status(201).json({ message: "User created successfully", user: newUser });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
