const mongoose = require("mongoose");
// mongoose.connect("mongodb://127.0.0.1:27017/miniproject");
require("../db");
const feesSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, // User reference
  case_ref_no: { type: String, required: true },
  clientName: { type: String, required: true },
  fees: { type: Number, required: true },
  amount_paid: { type: Number, required: true },
  pending_fees: { type: Number, required: true },
  payment_mode: { type: String, enum: ["Cash", "Card", "Online"], required: true },
  due_date: { type: Date, required: true },
  remarks: { type: String },
});



module.exports= mongoose.model('fees', feesSchema);

