require("dotenv").config();
const express = require('express');
const app = express();
const connectDB = require("./db"); // Import connection function
// Connect to MongoDB
connectDB();
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const userModel = require("./models/user");
const clientModel = require("./models/client");
const FeesModel = require("./models/fees");
const otpModel = require("./models/otpModel");

const moment = require('moment');
const twilio = require('twilio');
app.set("trust proxy", 1);
const cors = require("cors");
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://lawconnect-wxr0.onrender.com","positive-liberal-treefrog.ngrok-free.app","personally-allowing-lacewing.ngrok-free.app",
        "http://localhost:5173","https://law-connect-lilac.vercel.app"
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies/auth headers
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

const postModel = require("./models/post");
const casesModel = require("./models/cases");
const cookieParser = require('cookie-parser');
const path = require('path');

app.use(express.json({ limit: "50mb" })); // Adjust size as needed
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// app.use(bodyParser.json());
// app.get('/', (req, res) => {
//   res.render("index");
// });
// app.get('/login', (req, res) => {
//   res.render("login");
// })

const isLoggedIn = (req, res, next) => {
  console.log("🔍 Checking authentication...");
  console.log("🔍 Cookies:", req.cookies);
  console.log("🔍 Headers:", req.headers);

  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("❌ No valid token found in cookies");
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("✅ Decoded User:", req.user) // Debugging
    next();
  } catch (error) {
    console.log("❌ Token verification failed:", error.message);
    return res.status(403).json({ error: "Forbidden: Invalid token" });
  }
};


// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find user by email
//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     // Compare hashed password
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return res.status(401).json({ message: "Incorrect password" });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
//     console.log("generated token", token);
//     // Set token in HTTP-only cookie
//     res.cookie("token", token, {
//       httpOnly: true, // Prevents JavaScript access
//       secure: false, // Set to true in production with HTTPS
//       // sameSite: "lax", // Change to "none" if frontend & backend are on different domains
//       sameSite: "None" // Needed for cross-site requests
//     });

//     res.json({ message: "Login successful" });

//   } catch (error) {
//     console.error("Login error:", error);
//     res.sendStatus(500); // Internal server error
//   }
// });
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Compare hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Generated token:", token);

    // Set cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true for production
      sameSite: "none" // For cross-origin requests
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error.message); // Log the error message
    res.sendStatus(500);
  }
});

app.get("/getcases", isLoggedIn, async (req, res) => {
  console.log("req.user:", req.user); // Debugging
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized: No user found in request" });
  }

  try {
    const user = await userModel.findOne({ email: req.user.email }).populate("cases");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.cases);
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.sendStatus(500);
  }
});

// app.post('/register', async (req, res) => {
//   let { name, age, email, password, secretString } = req.body;//so that you dont have to write req.body with variables again and again
//   console.log(req.body);

//   // let user = await userModel.deleteOne({ email });
//   let existingUser = await userModel.findOne({ email });
//   if (existingUser) return res.status(400).send("User already registered");

//   // if(user) return res.status(500).send("user already registered");
//   bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, async (err, hash) => {
//       let user = await userModel.create({
//         name,
//         age,
//         email,
//         password: hash,
//         secretString
//       });
//       let token = jwt.sign({ email: email, userid: user._id }, process.env.JWT_SECRET);
//       res.cookie("token", token);
//       res.send("registered");
//     })
//   })
// });
app.post('/register', async (req, res) => {
  let { name, age, email, password, secretString } = req.body;
  console.log("Received Registration Data:", req.body);

  if (!name || !email || !password || !age || !secretString) {
    return res.status(400).send("Missing required fields");
  }

  let existingUser = await userModel.deleteOne({ email });

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user = await userModel.create({
      name,
      age,
      email,
      password: hashedPassword,
      secretString
    });

    let token = jwt.sign({ email: email, userid: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token);
    res.status(200).send("registered");
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send("User already registered");
    }
    console.error("Error creating user:", error);
    return res.status(500).send("Error creating user");
  }
});
//  app.post('/post',isLoggedIn, async(req,res)=>{
//       let user= await userModel.findOne({email: req.user.email});
//       let {content} = req.body;

//       let post= await postModel.create({
//         user: user._id,
//         content
//       });
//       user.posts.push(post._id);
//       await user.save();
//       res.redirect("/profile");
//  });
app.get('/improvising', async (req, res) => {
  await userModel.deleteOne({ username: "dev" });
  res.redirect("/");
});
app.get('/toknow', async (req, res) => {
  let contents = await userModel.find();
  res.send(contents);
});
app.get('/toknowcl', async (req, res) => {
  let contents = await clientModel.find();
  res.send(contents);
});
app.get('/toknowc', async (req, res) => {
  let contents = await casesModel.find();
  res.send(contents);
});
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // true in production
    sameSite: "Lax"
  });
  res.json({ message: "Logged out" });
});

app.get('/read', async (req, res) => {
  const user = await userModel.findOne({ username: "xyz" });
  res.send(user);
})
//protected routes work only when logged in
// Middleware to check if user is logged in
// GET Profile Data
app.get("/profile", isLoggedIn, async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure default values for missing fields
    res.json({
      name: user.name || "",
      email: user.email || "",
      age: user.age || "",
      contact: user.contact || "",
      casesHandled: user.casesHandled || 0,
      casesWon: user.casesWon || 0,
      profilePic: user.profilePic || "",
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// PUT Update Profile Data
app.put("/updateProfile", isLoggedIn, async (req, res) => {
  try {
    const { name, age, contact, profilePic } = req.body;

    const updatedUser = await userModel.findOneAndUpdate(
      { email: req.user.email },
      { $set: { name, age, contact, profilePic } }, // Ensure update is correctly applied
      { new: true } // Return updated user
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.get("/like/:id", isLoggedIn, async (req, res) => {
  let post = await postModel.findOne({ _id: req.params.id }).populate("user");
  if (post.likes.indexOf(req.user.userid) === -1) {
    post.likes.push(req.user.userid);
  }
  else {
    post.likes.splice(post.likes.indexOf(req.user.userid), 1);
  } ƒ

  await post.save();
  res.redirect("/profile");
});
app.get("/edit/:id", isLoggedIn, async (req, res) => {
  let post = await postModel.findOne({ _id: req.params.id }).populate("user");
  res.render("edit", { post });
});
app.post("/update/:id", isLoggedIn, async (req, res) => {
  let post = await postModel.findOneAndUpdate({ _id: req.params.id }, { content: req.body.content })

  res.redirect("/profile", otp);
});
app.post("/advocate", async (req, res) => {
  const { name, email, age } = req.body;
  console.log(req.body);
  
  if (!name || !email || !age) {
    return res.status(400).send("Name, email, and age are required.");
  }
  
  try {
    // Generate OTP
    const generateOtp = () => Math.floor(100000 + Math.random() * 900000);
    const otp = generateOtp();

    console.log("Generated OTP:", otp);

    // Configure the transporter for nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Hello, your OTP code is: ${otp}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, async (err, info) => {
      if (err) {
        console.error("Error:", err);
        return res.status(500).send("Error sending email");
      } else {
        console.log("Email sent:", info.response);
        
        // Store OTP with all required fields
        await otpModel.create({ 
          email, 
          otp,
          type: 'email',
          // If you need userId, you might need to create a temporary user first
          // or modify the schema to make userId optional
        });
        
        res.status(200).send("OTP sent successfully");
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error sending OTP");
  }
});

// POST endpoint to verify OTP and create user
app.post("/verifyotp", async (req, res) => {
  const { name, email, age, otp } = req.body;

  try {
    // Find the OTP entry by email
    const otpEntry = await otpModel.findOne({ email });

    if (!otpEntry) {
      return res.status(404).send("OTP not found or expired");
    }

    // Compare the OTPs
    if (otpEntry.otp === parseInt(otp, 10)) {
      console.log("OTP verified successfully");
      
      // Create user only after OTP is verified
      await userModel.create({ name, email, age });
      
      // Remove OTP entry after successful verification
      await otpModel.deleteOne({ email });
      
      res.status(200).send("User created successfully");
    } else {
      console.log("Incorrect OTP");
      res.status(400).send("Incorrect OTP");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error verifying OTP");
  }
});

app.get("/casesinfo", isLoggedIn, async (req, res) => {
  let info = await casesModel.find();
  res.send(info);
});
app.post("/createcase", isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  try {
    const { case_ref_no, caseTitle, clientName, status, nextHearing, fees, pending_fees } = req.body;

    // Create a new case
    const newCase = await casesModel.create({
      user: user._id,
      case_ref_no,
      caseTitle,
      clientName,
      status,
      nextHearing: nextHearing, // Match field name in schema
      fees,
      pending_fees,
    });
    await newCase.save();
    user.cases.push(newCase._id);

    await user.save();
    res.status(201).json({ success: true, message: "Case created successfully", case: newCase });
  } catch (error) {
    console.error("Error creating case:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
app.put("/updatecase/:case_ref_no", async (req, res) => {
  try {
    const updatedCase = await casesModel.findOneAndUpdate(
      { case_ref_no: req.params.case_ref_no },
      {
        caseTitle: req.body.caseTitle,
        clientName: req.body.clientName,
        status: req.body.status,
        nextHearing: req.body.nextHearing ? new Date(req.body.nextHearing) : null, // Convert to Date
        fees: req.body.fees,
        pending_fees: req.body.pending_fees,
      },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ success: false, message: "Case not found" });
    }

    res.status(200).json({ success: true, message: "Case updated successfully", case: updatedCase });
  } catch (error) {
    console.error("Error during update:", error);
    res.status(500).json({ success: false, message: "An error occurred while updating the case" });
  }
});

// Get client details by case reference number
app.get("/clients/:case_ref_no", async (req, res) => {
  try {
    const { case_ref_no } = req.params;
    const client = await clientModel.findOne({ case_ref_no });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all clients
app.get("/clients", isLoggedIn, async (req, res) => {
  console.log("req.user:", req.user); // Debugging

  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized: No user found in request" });
  }

  try {
    const user = await userModel.findOne({ email: req.user.email }).populate("client");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.client);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Create a new client
app.post("/createclient", isLoggedIn, async (req, res) => {
  try {
    const { client_name, phone, case_ref_no } = req.body;

    // Find the logged-in user
    const user = await userModel.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the client with the same case_ref_no already exists for this user
    const existingClient = await clientModel.findOne({ case_ref_no, user: user._id });
    if (existingClient) {
      return res.status(400).json({ message: "Case reference number already exists for this user" });
    }

    // Create a new client associated with the logged-in user
    const newClient = new clientModel({ client_name, phone, case_ref_no, user: user._id });
    await newClient.save();

    // Link the client to the user
    user.client.push(newClient._id);
    await user.save();

    res.status(201).json({ success: true, message: "Client created successfully", client: newClient });
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


app.delete("/deletecases/:caseTitle", async (req, res) => {
  const { caseT } = req.params;
  let result = await casesModel.deleteOne({ caseT });
  if (result) {
    res.send("deleted");
  }
  else {
    res.send("eroor");
  }
});
app.delete("/deletecase/:case_ref_no", async (req, res) => {
  const { case_ref_no } = req.params;

  if (isNaN(case_ref_no)) {
    return res.status(400).json({ success: false, message: "Invalid case reference number" });
  }

  try {
    const result = await casesModel.deleteOne({ case_ref_no: Number(case_ref_no) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Case not found" });
    }

    res.status(200).json({ success: true, message: "Case deleted successfully" });
  } catch (error) {
    console.error("Error deleting case:", error);
    res.status(500).json({ success: false, message: "Failed to delete case" });
  }
});
app.delete("/deleteadv/:email", async (req, res) => {
  const { email } = req.params;  // ✅ Correctly extract "email"

  try {
    const deletedUser = await userModel.deleteOne({ email }); // ✅ Use email to find and delete user

    if (deletedUser.deletedCount === 0) {
      return res.status(404).send("User not found");  // ✅ Handle case where user isn't found
    }

    res.send("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Error deleting user");
  }
});

app.get("/hearings", isLoggedIn, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Fetch hearings only for the logged-in user
    const cases = await casesModel.find({ user: req.user.id }, "nextHearing");

    res.json(cases.map((c) => c.nextHearing)); // Convert to JSON array
  } catch (error) {
    console.error("Error fetching hearing dates:", error);
    res.status(500).json({ error: "Failed to fetch hearing dates" });
  }
});

app.get("/pendingcases", isLoggedIn, async (req, res) => {
  try {
    const pendingCases = await casesModel.find(
      { user: req.user.id, status: "Pending" },
      "caseTitle clientName nextHearing"
    );

    res.json(pendingCases);
  } catch (error) {
    console.error("Error fetching pending cases:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



// ✅ Create Fee Record
// ✅ Create a Fee Record (Authenticated & Linked to User)
app.post("/createfee", isLoggedIn, async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract all required fields from req.body
    const { case_ref_no, clientName, fees, amount_paid, pending_fees, payment_mode, due_date, remarks } = req.body;

    // Check if all required fields are present
    if (!case_ref_no || !clientName || !fees || !amount_paid || !pending_fees || !payment_mode || !due_date) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const newFee = new FeesModel({
      user: user._id,
      case_ref_no,
      clientName,
      fees,
      amount_paid,
      pending_fees,
      payment_mode,
      due_date: new Date(due_date),
      remarks,
    });

    await newFee.save();


    user.fees.push(newFee._id);
    await user.save();
    res.status(201).json({ success: true, message: "Fee record created successfully!", fee: newFee });
  } catch (error) {
    console.error("Error creating fee record:", error);
    res.status(500).json({ success: false, message: "Failed to create fee record" });
  }
});


// ✅ Get Fees for Logged-in User
app.get("/getfees", isLoggedIn, async (req, res) => {
  try {
    console.log("Fetching fees for user:", req.user.email);

    const user = await userModel.findOne({ email: req.user.email }).populate("fees");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.fees);
  } catch (error) {
    console.error("Error fetching fees:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve fees" });
  }
});

app.post("/existing", async (req, res) => {
  const { email, secretString } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    if (user.secretString !== secretString) {
      return res.status(401).json({ message: "Incorrect secret key" });
    }

    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
app.put("/updatefee/:id", async (req, res) => {
  try {
    const updatedFee = await FeesModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFee) return res.status(404).json({ message: "Fee record not found" });
    res.json({ message: "Fee record updated successfully!", updatedFee });
  } catch (error) {
    console.error("Error updating fee record:", error);
    res.status(500).json({ message: "Failed to update fee record" });
  }
});


app.delete("/deletefee/:id", async (req, res) => {
  try {
    const deletedFee = await FeesModel.findByIdAndDelete(req.params.id);
    if (!deletedFee) return res.status(404).json({ message: "Fee record not found" });
    res.json({ message: "Fee record deleted successfully!" });
  } catch (error) {
    console.error("Error deleting fee record:", error);
    res.status(500).json({ message: "Failed to delete fee record" });
  }
});
app.get("/verify-token", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
