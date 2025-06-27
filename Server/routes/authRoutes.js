import express from 'express';
import {
  register,
  login,
  logout,
  sendOTP,
  verifyOTP,
  verifyExisting,
  verifyToken,
  resetPassword
} from '../controllers/authController.js'; 

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/advocate', sendOTP);
router.post('/verifyotp', verifyOTP);
router.post('/existing', verifyExisting);
router.get('/verify-token', verifyToken);
router.post('/reset-password', resetPassword); 

export default router; // Export the router instance as a default export