const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error("Email must be valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate: (value) => {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password must be Strong");
        }
      },
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
      validate: (value) => {
        if (!validator.isURL(value)) {
          throw new Error("Url must be valid");
        }
      },
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

userSchema.methods.getJWT = async function () {
  const token = await jwt.sign({ _id: this._id }, "Anthony@123", { expiresIn: "7d" });
  return token;
};

userSchema.methods.validatePassword = async function (userInputPassword) {
  const passwordHash = this.password;
  const isPasswordValid = await bcrypt.compare(userInputPassword, passwordHash);
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
