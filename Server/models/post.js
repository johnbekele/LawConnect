import mongoose from 'mongoose';

// As with other models, it's generally recommended to establish your database connection
// in a central file (e.g., your main server file like app.js or server.js)
// and not within each model file for ES Modules.
// Assuming your database connection is handled elsewhere before this model is used.

const postSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  date: {
    type: Date,
    default: Date.now
  },
  content: String,
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    }
  ]
});

// Export the Mongoose model as a default export
export default mongoose.model('post', postSchema);