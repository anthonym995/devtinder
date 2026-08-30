const socket = require("socket.io");
const crypto = require("node:crypto");
const { Chat } = require("../models/chat");

const getRoomId = (userId, targetUserId) => {
  return crypto.createHash("sha256").update([userId, targetUserId].sort().join("-")).digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // console.log("a user connected");

    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = getRoomId(userId, targetUserId);
      socket.join(roomId);
    });

    socket.on("sendMessage", async ({ userId, targetUserId, text }) => {
      try {
        const roomId = getRoomId(userId, targetUserId);
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        });
        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
          });
        }

        chat.messages.push({ senderId: userId, text });
        await chat.save();
        io.to(roomId).emit("receiveMessage", { userId, targetUserId, text });
      } catch (err) {
        console.log(err);
      }
      // console.log(firstName + " " + text)
      // console.log(`${firstName} sent a message in chat ${roomId} : ${text}`);
      // socket.to(roomId).emit("receiveMessage", { firstName, userId, targetUserId, text });
    });

    socket.on("disconnected", () => {
      // console.log("a user disconnected");
    });
  });
};

module.exports = initializeSocket;
