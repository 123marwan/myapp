const mongoose = require("mongoose");

async function connectDatabase(mongoUri) {
  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
}

module.exports = { connectDatabase };