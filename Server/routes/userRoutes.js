import express from 'express';
// Import individual functions from the UserController, as it was converted to function methods
import {
  getProfile,
  updateProfile,
  deleteUser,
  getAllUsers
} from '../controllers/UserController.js'; // Note the .js extension and named imports
import isLoggedIn from '../middleware/auth.js'; // Assuming auth middleware is also an ES module

const router = express.Router();

// Define routes using the imported function methods
router.get('/profile', isLoggedIn, getProfile);
router.put('/updateProfile', isLoggedIn, updateProfile);
router.delete('/deleteadv/:email', deleteUser);

// Debug routes
router.get('/toknow', getAllUsers);

export default router; // Export the router instance as a default export