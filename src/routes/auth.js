const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignupData } = require("../utils/validate");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;
    // Encrpt password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    res.send(savedUser);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });

    if (!user) throw new Error("Invalid Credentials");

    const isAuthendicated = await user.validatePassword(password);

    if (isAuthendicated) {
      const token = await user.getJWT();
      res.cookie("token", token);
      res.send("logged in Successfully!!!");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});


module.exports = authRouter;
