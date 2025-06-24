const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/clientController.js');
const { isLoggedIn } = require('../middleware/auth.js');

router.get('/clients', isLoggedIn, ClientController.getClients);
router.get('/clients/:case_ref_no', ClientController.getClientByCaseRef);
router.post('/createclient', isLoggedIn, ClientController.createClient);

// Debug routes
router.get('/toknowcl', ClientController.getAllClients);

module.exports = router;