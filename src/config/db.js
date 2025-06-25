const mongoose = require("mongoose");

// "mongodb+srv://anthonym:1kG6QWtYuh7AOkIt@database.uqx0sjr.mongodb.net/?retryWrites=true&w=majority&appName=database";
const URL = "mongodb+srv://anthonym:1kG6QWtYuh7AOkIt@database.uqx0sjr.mongodb.net/devTinder";

const connectDB = async () => {
  await mongoose.connect(URL);
};

module.exports = { connectDB };
