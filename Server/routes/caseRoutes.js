import express from 'express';
// Import individual functions from the CaseController, as it was converted to function methods
import {
  getCases,
  createCase,
  updateCase,
  deleteCase,
  getHearings,
  getPendingCases,
  getAllCases
} from '../controllers/CaseController.js'; // Note the .js extension and named imports
import isLoggedIn from '../middleware/auth.js'; // Assuming auth middleware is also an ES module

const router = express.Router();

// Define routes using the imported function methods
router.get('/getcases', isLoggedIn, getCases);
router.post('/createcase', isLoggedIn, createCase);
router.put('/updatecase/:case_ref_no', updateCase);
router.delete('/deletecase/:case_ref_no', deleteCase);
router.get('/hearings', isLoggedIn, getHearings);
router.get('/pendingcases', isLoggedIn, getPendingCases);

// Debug routes
router.get('/casesinfo', isLoggedIn, getAllCases);
router.get('/toknowc', getAllCases); // This route seems to be a duplicate of /casesinfo without isLoggedIn, ensure intended behavior

export default router; // Export the router instance as a default export