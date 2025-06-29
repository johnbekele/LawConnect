import express from 'express';

import {
  getProfile,
  updateProfile,
  deleteUser,
  getAllUsers
} from '../controllers/userController.js'; 
import isLoggedIn from '../middleware/auth.js'; 
import upload from '../config/multerConfig.js';


const router = express.Router();

// Define routes using the imported function methods
router.get('/profile', isLoggedIn, getProfile);
router.put('/updateProfile', isLoggedIn,upload.single('profilePic'), updateProfile);
router.delete('/deleteadv/:email', deleteUser);

// Debug routes
router.get('/toknow', getAllUsers);

export default router; 