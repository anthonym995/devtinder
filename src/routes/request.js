const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const { firstName } = req.user;
    res.send(firstName + " send the connection request");
  } catch (err) {
    res.status(400).send();
  }
});

module.exports = requestRouter;