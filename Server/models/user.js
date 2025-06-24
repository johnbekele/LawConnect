const mongoose = require("mongoose");
require("../db"); // Import the connection file

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  contact: { type: String, default: "" },
  casesHandled: { type: Number, default: 0 },
  casesWon: { type: Number, default: 0 },
  profilePic: { type: String, default: "" },
  secretString: { type: String },
  cases: [{ type: mongoose.Schema.Types.ObjectId, ref: "cases" }],
  client: [{ type: mongoose.Schema.Types.ObjectId, ref: "client" }],
  fees: [{ type: mongoose.Schema.Types.ObjectId, ref: "fees" }],
});

module.exports = mongoose.model("User", userSchema);
