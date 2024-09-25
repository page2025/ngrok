const express = require("express");
const ngrok = require("@ngrok/ngrok");
const { authtoken } = require("ngrok");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
// Create an Express application
const app = express();
const PORT = 8080;

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",

  port: 587,
  //   secure: true, // use SSL
  auth: {
    user: "77eb6b001@smtp-brevo.com",
    pass: "V32f9Cb5OpdJ01MP",
  },
});

// Define a route
app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "page.html");
  const stat = fs.statSync(filePath);
  res.sendFile(filePath);
});
const random = Math.floor(Math.random() * 3) + 1;
const auth_token_ngr = `NGROK_AUTHTOKEN${random}`;
const auth_token_ng = process.env[auth_token_ngr];
app.get("/start", async (req, res) => {
  ngrok
    .connect({ addr: PORT, authtoken: auth_token_ng })
    .then(async (listener) => {
      console.log(`Ingress established at: ${listener.url()}`);

      const mailOptions = {
        from: '"mail" <youssefelhaimer8@gmail.com>',
        to: "youssefelhaimer8@gmail.com",
        subject: "invoice",
        text: `Ingress established at: ${listener.url()}`,
      };

      const info = await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("Error:", error);
            return reject(error);
          }
          resolve(info);
        });
      });
      res.send({ info });
    })
    .catch((err) => console.error("Error establishing ngrok connection:", err));
});

// Start the Express server
app.listen(PORT, () => {
  console.log(
    `Node.js Express server is running at http://localhost:${PORT}...`
  );

  // Get your endpoint online with ngrok
});
