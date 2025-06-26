import mongoose from 'mongoose';

// As with other models, it's generally recommended to establish your database connection
// in a central file (e.g., your main server file like app.js or server.js)
// and not within each model file using 'require("../db");' for ES Modules.
// Assuming your database connection is handled elsewhere before this model is used.

const clientSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true // Ensures each client is associated with a user
  },
  client_name: {
    type: String,
    required: true, // Ensures the client name is mandatory
    trim: true,     // Removes extra spaces
  },
  phone: {
    type: Number,
    required: true,
    validate: {
      validator: (value) => /^\d{10}$/.test(value), // Ensures the phone number is 10 digits
      message: "Phone number must be 10 digits",
    },
  },
  case_ref_no: {
    type: Number,
    required: true,
    unique: true, // Ensures each case_ref_no is unique across all clients
  },
});

// Export the Mongoose model as a default export
export default mongoose.model('client', clientSchema);