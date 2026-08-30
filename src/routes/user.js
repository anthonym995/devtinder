const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_FIELDS = ["firstName", "lastName", "emailId", "age", "skills", "gender", "photoUrl", "about"];

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connections = await ConnnectionRequest.find({
      toUserId: user._id,
      status: "interested",
    }).populate("fromUserId", USER_FIELDS);

    // if (connections.length === 0) {
    //   return res.status(404).json({ message: "No connection requests found" });
    // }

    res.json({ message: "data fetched success", data: connections });
  } catch (err) {
    res.status(400).send({ message: "Error: " + err.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connections = await ConnnectionRequest.find({
      $or: [
        { fromUserId: user._id, status: "accepted" },
        { toUserId: user._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_FIELDS)
      .populate("toUserId", USER_FIELDS);

    const data = connections.map((row) => {
      if (row.fromUserId._id.equals(user._id)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ message: "data fetched success", data });
  } catch (err) {
    res.status(400).send({ message: "Error: " + err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    // User should seee all user cards except
    // his own card
    // his connection
    // ignored people should not see
    // already send the connection request
    const loggedUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connections = await ConnnectionRequest.find({
      $or: [{ fromUserId: loggedUser._id }, { toUserId: loggedUser._id }],
    }).select("fromUserId toUserId");

    const hideUser = new Set();

    connections.forEach((c) => {
      hideUser.add(c.fromUserId.toString());
      hideUser.add(c.toUserId.toString());
    });

    const userlist = await User.find({
      $and: [{ _id: { $nin: Array.from(hideUser) } }, { _id: { $ne: loggedUser._id } }],
    })
      .skip(skip)
      .limit(limit);

    res.json({ data: userlist });
  } catch (err) {
    res.status(400).send({ message: "Error : " + err.message });
  }
});

userRouter.get("/user/:userId", userAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select(USER_FIELDS);
    res.json(user);
  } catch (err) {
    res.status(400).send({ message: "Error : " + err.message });
  }
});

module.exports = userRouter;
