import mongoose from 'mongoose';

// It's generally recommended to establish your database connection
// in a central file (e.g., your main server file like app.js or server.js)
// and not within each model file using 'require("../db");' for ES Modules.
// Assuming your database connection is handled elsewhere before this model is used.

const casesSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true // Ensures each case is associated with a user
  },
  caseTitle: String,
  clientName: String,
  status: {
    type: String,
    enum: ['Closed', 'Active', 'Pending', 'won'] // Enum validation for status
    // Optionally, you can make status a required field by adding 'required: true'
  },
  nextHearing: Date,
  case_ref_no: Number,
  fees: Number,
  pending_fees: Number,
  posts: [
    { type: mongoose.Schema.Types.ObjectId, ref: "post" }
  ]
},{timestamps: true});

// Export the Mongoose model as a default export
export default mongoose.model('cases', casesSchema);
