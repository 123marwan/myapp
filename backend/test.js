require("dotenv").config();
const mongoose = require("mongoose");

console.log("URI found:", process.env.MONGO_URI ? "YES" : "NO");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.log("❌ Connection failed:", err.message);
    process.exit(1);
  });