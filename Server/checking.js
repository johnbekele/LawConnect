// const express = require('express');
// const app = express();
// const nodemailer = require('nodemailer');

// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const userModel = require("./models/user");
// const moment = require('moment');
// const twilio = require('twilio');
// const postModel = require("./models/post");
// const casesModel = require("./models/cases");
// const cookieParser = require('cookie-parser');
// const path = require('path');

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com", // Use your email provider's SMTP server
//   port: 587, // 587 for TLS, 465 for SSL
//   secure: false, // true for SSL, false for TLS
//   auth: {
//     user: "devyani04sh@gmail.com", // Your email
//     pass: "lfgy ohoe jyqc qrwt", // App password (not your email password)
//   },
// });

// const mailOptions = {
//   from: "devyani04sh@gmail.com",
//   to: "devyanisharmaa15@gmail.com",
//   subject: "Test Email",
//   text: "Hello, this is a test email!",
// };

// transporter.sendMail(mailOptions, (err, info) => {
//   if (err) {
//     console.error("Error:", err);
//   } else {
//     console.log("Email sent:", info.response);
//   }
// });