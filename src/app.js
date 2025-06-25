const express = require("express");
const { connectDB } = require("./config/db");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  
  // if (!firstName || !lastName || !emailId || !password) {
  //   res.status(400).send("all field must be required");
  // }
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.send(savedUser);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

app.get("/feed", async (req, res) => {
  const userList = await User.find({});
  if (!userList) {
    res.status(404).send("User list not found");
  } else {
    res.send(userList);
  }
});

app.get("/user", async (req, res) => {
  try {
    const userById = await User.findById(req.body._id);
    if (!userById) {
      res.status(404).send("User not found");
    } else {
      res.send(userById);
    }
  } catch (err) {
    console.log("something went wrong");
  }
});

app.patch("/user", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.body._id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send(updatedUser);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.body._id);
    res.send(deletedUser);
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

connectDB()
  .then(() => {
    console.log("Database connection Successfull..");
    app.listen(3000, () => {
      console.log("server running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected ");
  });
