const express = require("express");
const ngrok = require("@ngrok/ngrok");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 8080;

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "77eb6b001@smtp-brevo.com",
    pass: "V32f9Cb5OpdJ01MP",
  },
});

// Define a route
app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "page.html");
  res.sendFile(filePath);
});

const random = Math.floor(Math.random() * 2) + 1;
const auth_token_ngr = `NGROK_AUTHTOKEN${random}`;
const auth_token_ng = process.env[auth_token_ngr];

app.get("/start", async (req, res) => {
  try {
    // Start ngrok
    const listener = await ngrok.connect({
      addr: PORT,
      authtoken: auth_token_ng,
      request_header_add: [
        "ngrok-skip-browser-warning:true", // Skip browser warning
      ],
    });

    // Email options
    const mailOptions = {
      from: '"mail" <youssefelhaimer8@gmail.com>',
      to: "youssefelhaimer8@gmail.com",
      subject: "Ngrok URL",
      text: `Ingress established at: ${listener}`,
    };

    // Send email with ngrok URL
    await transporter.sendMail(mailOptions);

    res.send({ url: listener.url() });
  } catch (err) {
    console.error("Error establishing ngrok connection:", err);
    res.status(500).send("Failed to establish ngrok connection.");
  }
});
// Start the Express server
app.listen(PORT, () => {
  console.log(
    `Node.js Express server is running at http://localhost:${PORT}...`
  );
});
