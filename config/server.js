const express = require("express");
const axios = require("axios");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const app = express();

app.use(express.json());

// Serve static files from the root workspace directory
app.use(express.static(path.join(__dirname, "..")));

// Serve index.html at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});


// ── Verify Paystack Transaction ──────────────────────────────────────────────
app.post("/verify", async (req, res) => {
  const { reference, amount, email } = req.body;

  if (!reference) {
    return res.status(400).json({ success: false, message: "No reference provided" });
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    const txn = response.data.data;

    if (txn.status === "success") {
      console.log(`✅ Donation verified: ${reference} | ${email} | amount: ${amount}`);
      return res.json({
        success: true,
        status: "success",
        message: "Donation verified successfully",
        data: {
          reference,
          amount,
          email,
          transaction_id: txn.id,
          paid_at: txn.paid_at
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        status: "failed",
        message: "Payment not successful"
      });
    }

  } catch (error) {
    console.error("Verification error:", error.response?.data || error.message);
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
});

// ── Webhook endpoint ─────────────────────────────────────────────────────────
app.post("/webhook", async (req, res) => {
  const event = req.body;
  console.log("Webhook received:", JSON.stringify(event));

  // Acknowledge receipt immediately
  res.status(200).json({ received: true });

  if (event.event === "charge.success") {
    const data = event.data || {};
    console.log(`💰 Webhook charge.success: ref=${data.reference} amount=${data.amount}`);
    // TODO: update your database / send confirmation email here
  }
});

const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.listen(PORT, () => {
  console.log(`🚀 Imani Childrens Home server running on port ${PORT}`);
  console.log(`   Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
  console.log(`   Paystack public key: ${process.env.PAYSTACK_PUBLIC_KEY ? process.env.PAYSTACK_PUBLIC_KEY.slice(0, 20) + "..." : "NOT SET"}`);
  if (!isProduction) {
    console.log(`   Open http://localhost:${PORT} in your browser`);
  }
});
