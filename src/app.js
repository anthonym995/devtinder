require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/db");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const http = require("http");

require("./utils/cronjob");

const { setServers } = require("node:dns/promises");
const initializeSocket = require("./utils/socket");
setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connection Successfull..");
    server.listen(PORT, () => {
      console.log("server running on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
    console.error("Database cannot be connected ");
  });

// app.get("/feed", async (req, res) => {
//   const userList = await User.find({});
//   if (!userList) {
//     res.status(404).send("User list not found");
//   } else {
//     res.send(userList);
//   }
// });

// app.get("/user", async (req, res) => {
//   try {
//     const userById = await User.findById(req.body._id);
//     if (!userById) {
//       res.status(404).send("User not found");
//     } else {
//       res.send(userById);
//     }
//   } catch (err) {
//     console.log(err.message);
//   }
// });

// app.patch("/user/:userId", async (req, res) => {
//   try {
//     const data = req.body;
//     const userId = req.params.userId;
//     console.log(userId, data);
//     const allowed = ["firstName", "lastName", "age", "gender", "photoUrl", "about", "skills"];
//     const isAllowed = Object.keys(data).every((k) => allowed.includes(k));
//     if (!isAllowed) {
//       throw new Error("Update not allowed");
//     }
//     if (data?.skills?.lenght > 10) {
//       throw new Error("Skills cannot be more then 10");
//     }
//     const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
//       returnDocument: "after",
//       runValidators: true,
//     });
//     res.send(updatedUser);
//   } catch (err) {
//     res.status(400).send(err.message);
//   }
// });

// app.delete("/user", async (req, res) => {
//   try {
//     const deletedUser = await User.findByIdAndDelete(req.body._id);
//     res.send(deletedUser);
//   } catch (err) {
//     res.status(400).send(err.message);
//   }
// });
