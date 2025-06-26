import express from 'express';
// Import individual functions from the ClientController, as it was converted to function methods
import {
  getClients,
  getClientByCaseRef,
  createClient,
  getAllClients
} from '../controllers/ClientController.js'; // Note the .js extension and named imports
import  isLoggedIn  from '../middleware/auth.js'; // Assuming auth middleware is also an ES module

const router = express.Router();

// Define routes using the imported function methods
router.get('/clients', isLoggedIn, getClients);
router.get('/clients/:case_ref_no', getClientByCaseRef);
router.post('/createclient', isLoggedIn, createClient);

// Debug routes
router.get('/toknowcl', getAllClients);

export default router; // Export the router instance as a default export