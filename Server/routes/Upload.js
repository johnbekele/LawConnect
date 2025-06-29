import express from 'express';
import uploadController from '../controllers/uploadController.js';
import upload from '../config/multerConfig.js';
import isLoggedIn from '../middleware/auth.js';

const verifyJWT = isLoggedIn;


const router = express.Router();

router.post(
  '/avatar',
  isLoggedIn,
  upload.single('profilePic'),
  uploadController.uploadAvatar
);

export default router;
