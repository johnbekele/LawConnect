const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController.js');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/advocate', AuthController.sendOTP);
router.post('/verifyotp', AuthController.verifyOTP);
router.post('/existing', AuthController.verifyExisting);
router.get('/verify-token', AuthController.verifyToken);

module.exports = router;