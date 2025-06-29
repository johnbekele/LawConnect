import express from 'express';

import {
  getCases,
  createCase,
  updateCase,
  deleteCase,
  getHearings,
  getPendingCases,
  getAllCases
} from '../controllers/caseController.js'; 
import isLoggedIn from '../middleware/auth.js';

const router = express.Router();

// Define routes using the imported function methods
router.get('/getcases', isLoggedIn, getCases);
router.post('/createcase', isLoggedIn, createCase);
router.put('/updatecase/:case_ref_no',isLoggedIn, updateCase);
router.delete('/deletecase/:case_ref_no',isLoggedIn, deleteCase);
router.get('/hearings', isLoggedIn, getHearings);
router.get('/pendingcases', isLoggedIn, getPendingCases);

// Debug routes
router.get('/casesinfo', isLoggedIn, getAllCases);
router.get('/toknowc', getAllCases); 

export default router; 