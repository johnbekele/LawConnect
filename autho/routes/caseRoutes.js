const express = require('express');
const router = express.Router();
const CaseController = require('../controllers/caseController.js');
const { isLoggedIn } = require('../middleware/auth.js');

router.get('/getcases', isLoggedIn, CaseController.getCases);
router.post('/createcase', isLoggedIn, CaseController.createCase);
router.put('/updatecase/:case_ref_no', CaseController.updateCase);
router.delete('/deletecase/:case_ref_no', CaseController.deleteCase);
router.get('/hearings', isLoggedIn, CaseController.getHearings);
router.get('/pendingcases', isLoggedIn, CaseController.getPendingCases);

// Debug routes
router.get('/casesinfo', isLoggedIn, CaseController.getAllCases);
router.get('/toknowc', CaseController.getAllCases);

module.exports = router;