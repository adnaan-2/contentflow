const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../controllers/authController');

// User Registration
router.post('/signup', registerUser);

// User Login
router.post('/login', loginUser);

module.exports = router;
