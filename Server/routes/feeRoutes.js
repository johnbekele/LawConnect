import express from 'express';

import {
  getFees,
  createFee,
  updateFee,
  deleteFee
} from '../controllers/feeController.js'; 
import isLoggedIn  from '../middleware/auth.js';

const router = express.Router();

// Define routes using the imported function methods
router.get('/getfees', isLoggedIn, getFees);
router.post('/createfee', isLoggedIn, createFee);
router.put('/updatefee/:id', updateFee);
router.delete('/deletefee/:id', deleteFee);

export default router; 