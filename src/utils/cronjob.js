const cron = require("node-cron");
const ConnectionRequest = require("../models/connectionRequest");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");

cron.schedule("0 8 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lte: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    const listOfEmails = [...new Set(pendingRequests.map((r) => r.toUserId.emailId))];

    for (const email of listOfEmails) {
      const res = await sendEmail.run(
        "New friend request pendingfor " + email,
        "There are friend request pending check that to login",
      );
      try {
      } catch (err) {
        console.log("Error: " + err);
      }
    }
  } catch (err) {
    console.log("Error: " + err);
  }
});
