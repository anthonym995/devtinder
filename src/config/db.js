const mongoose = require("mongoose");

// username - anthony
// password - Esw7GPSbu7bp0Oq0
// appname = devtinder

// mongodb+srv://anthony:<db_password>@devtinder.mtjqzxs.mongodb.net/?appName=devtinder
const URL = "mongodb+srv://anthony:Esw7GPSbu7bp0Oq0@devtinder.mtjqzxs.mongodb.net/devTinder";

const connectDB = async () => {
  await mongoose.connect(URL);
};

module.exports = { connectDB };
