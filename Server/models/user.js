import mongoose from 'mongoose';

// It's generally recommended to establish your database connection
// in a central file (e.g., your main server file like app.js or server.js)
// and not within each model file for ES Modules.
// Assuming your database connection is handled elsewhere before this model is used.

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

// Export the Mongoose model as a default export
export default mongoose.model('User', userSchema);