const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Debug middleware for auth routes
router.use((req, res, next) => {
  console.log('Auth Route:', req.method, req.path);
  next();
});

router.post('/register', register);
router.post('/login', login);

module.exports = router;
