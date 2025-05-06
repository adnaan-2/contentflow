const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const socialAccountsController = require('../controllers/socialAccountsController');

router.get('/status', auth, socialAccountsController.getStatus);
router.get('/connect/:platform', auth, socialAccountsController.connect);
router.post('/save-token/:platform', auth, socialAccountsController.saveToken);
router.post('/disconnect/:platform', auth, socialAccountsController.disconnect);

module.exports = router;