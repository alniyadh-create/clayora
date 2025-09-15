// netlify/functions/createOrder.js
const Razorpay = require("razorpay");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body = {};
  try { body = JSON.parse(event.body || "{}"); } catch(e) { /* ignore */ }

  const { amount, currency = "INR", receipt = "rcpt_" + Date.now() } = body;
  if (!amount || amount <= 0) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid amount" }) };
  }

  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await instance.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt,
      payment_capture: 1,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ order, key_id: process.env.RAZORPAY_KEY_ID }),
    };
  } catch (err) {
    console.error("createOrder error", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Order creation failed" }),
    };
  }
};