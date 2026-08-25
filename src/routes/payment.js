const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const instance = require("../utils/razorpay");
const Payment = require("../models/payment");
const User = require("../models/user");
const { membershipAmount } = require("../utils/constant");
const { validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;
    const order = await instance.orders.create({
      amount: membershipAmount[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        membershipType: membershipType,
      },
    });

    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      recipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.send("Error: " + err);
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get["X-Razorpay-Signature"];
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET,
    );

    if (!isWebhookValid) {
      res.status(400).json({ msg: "Webhook signature is invalid" });
    }

    // payment should update in the db
    const paymentDetails = req.body.payload.payment.entity;
    const payment = await Payment.find({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();

    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    await user.save();

    // update the user as  premium
    // return response status as sucess
    if (req.body.event == "payment.captured") {
    }
    if (req.body.event == "payment.failed") {
    }

    res.status(200).json({ msg: "webhook received successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = paymentRouter;
