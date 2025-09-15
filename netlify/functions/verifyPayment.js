// netlify/functions/verifyPayment.js
const crypto = require("crypto");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body = {};
  try { body = JSON.parse(event.body || "{}"); } catch(e) { /* ignore */ }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, msg: "Missing payment params" }) };
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    console.error("Missing RAZORPAY_KEY_SECRET env");
    return { statusCode: 500, body: JSON.stringify({ ok: false, msg: "Server misconfigured" }) };
  }

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(razorpay_order_id + "|" + razorpay_payment_id);
  const digest = shasum.digest("hex");

  if (digest === razorpay_signature) {
    // Payment verified. Here you should record order to DB or send invoice.
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } else {
    return { statusCode: 400, body: JSON.stringify({ ok: false, msg: "Invalid signature" }) };
  }
};