const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");


profileRouter.get("/profile", userAuth, async (req, res) => {
  try { 
    const { cookies } = req
    const user = req.user;
    res.send(user);

    console.log("Cookies: ", cookies);
    const 
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = profileRouter;