const mongoose = require("mongoose");

const URL = process.env.DB || "";

const connectDB = async () => {
  await mongoose.connect(URL);
};

module.exports = { connectDB };
