const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController.js');
const { isLoggedIn } = require('../middleware/auth.js');

router.get('/profile', isLoggedIn, UserController.getProfile);
router.put('/updateProfile', isLoggedIn, UserController.updateProfile);
router.delete('/deleteadv/:email', UserController.deleteUser);

// Debug routes
router.get('/toknow', UserController.getAllUsers);

module.exports = router;