const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateUserEditData, validatePassword } = require("../utils/validate");

const USER_FIELDS = ["firstName", "lastName", "emailId", "age", "skills", "gender", "photoUrl", "about"];

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const userData = {};
    USER_FIELDS.forEach((field) => {
      userData[field] = user[field];
    });
    res.send(userData);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateUserEditData(req)) {
      throw new Error("Invalid fields");
    }
    const currentUser = req.user;

    Object.keys(req.body).forEach((key) => (currentUser[key] = req.body[key]));

    console.log("Updated user: ", currentUser);
    await currentUser.save();

    res.json({ message: `${currentUser.firstName} your profile updated successfully.`, data: currentUser });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profil/password", userAuth, async (req, res) => {
  try {
    const User = req.user;
    const { currentPassword, newPassword } = req.body;
    const isValid = User.validatePassword(currentPassword);
    if (!isValid) throw new Error("Current password is incorrect");
    validatePassword(newPassword);
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    User.password = newPasswordHash;
    const data = await User.save();
    res.json({ message: "Password updated Successfully" });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
