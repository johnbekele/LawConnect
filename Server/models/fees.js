import mongoose from 'mongoose';

// As with other models, it's generally recommended to establish your database connection
// in a central file (e.g., your main server file like app.js or server.js)
// and not within each model file for ES Modules.
// Assuming your database connection is handled elsewhere before this model is used.
// The commented-out 'require("../db");' and 'mongoose.connect' lines have been removed
// as they are typically handled in the main application entry point for ES Modules.

const feesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true // Ensures each fee record is associated with a user
  },
  case_ref_no: {
    type: String,
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  fees: {
    type: Number,
    required: true
  },
  amount_paid: {
    type: Number,
    required: true
  },
  pending_fees: {
    type: Number,
    required: true
  },
  payment_mode: {
    type: String,
    enum: ["cash", "card", "online_payment" ,"bank_transfer" ,"creadit_card" ,"other"], // Enum validation for payment mode
    required: true
  },
  due_date: {
    type: Date,
    required: true
  },
  remarks: {
    type: String
  },
});

// Export the Mongoose model as a default export
export default mongoose.model('fees', feesSchema);