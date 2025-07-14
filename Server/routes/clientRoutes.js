import express from 'express';

import {
  getClients,
  getClientByCaseRef,
  createClient,
  getAllClients
} from '../controllers/clientController.js';
import  isLoggedIn  from '../middleware/auth.js';

const router = express.Router();

// Define routes using the imported function methods
router.get('/clients', isLoggedIn, getClients);
router.get('/clients/:case_ref_no', getClientByCaseRef);
router.post('/createclient', isLoggedIn, createClient);

// Debug routes
router.get('/toknowcl', getAllClients);

export default router; 