const mongoose = require("mongoose");
const { Schema } = mongoose;


const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate: (value) => {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender must be valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://placehold.jp/150x150.png",
    },
    about: {
      type: String,
      default: "This is the default description!",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
