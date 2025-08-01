const express = require('express');
const { signup, login, getProfile } = require('../Controllers/authController');
const { protect } = require('../Middleware/auth');

const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', protect, getProfile);

module.exports = router;
