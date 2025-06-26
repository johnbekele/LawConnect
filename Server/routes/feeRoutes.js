import express from 'express';
// Import individual functions from the FeeController, as it was converted to function methods
import {
  getFees,
  createFee,
  updateFee,
  deleteFee
} from '../controllers/FeeController.js'; // Note the .js extension and named imports
import isLoggedIn  from '../middleware/auth.js'; // Assuming auth middleware is also an ES module

const router = express.Router();

// Define routes using the imported function methods
router.get('/getfees', isLoggedIn, getFees);
router.post('/createfee', isLoggedIn, createFee);
router.put('/updatefee/:id', updateFee);
router.delete('/deletefee/:id', deleteFee);

export default router; // Export the router instance as a default export