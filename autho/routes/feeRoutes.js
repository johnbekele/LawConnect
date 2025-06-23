const express = require('express');
const router = express.Router();
const FeeController = require('../controllers/feeController.js');
const { isLoggedIn } = require('../middleware/auth.js');

router.get('/getfees', isLoggedIn, FeeController.getFees);
router.post('/createfee', isLoggedIn, FeeController.createFee);
router.put('/updatefee/:id', FeeController.updateFee);
router.delete('/deletefee/:id', FeeController.deleteFee);

module.exports = router;