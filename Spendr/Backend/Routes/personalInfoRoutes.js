const express = require('express');
const { createPersonalInfo, getPersonalInfo, updatePersonalInfo } = require('../Controllers/personalInfoController');
const { protect } = require('../Middleware/auth');

const router = express.Router();

// Create personal info
router.post('/', protect, createPersonalInfo);

// Get personal info
router.get('/', protect, getPersonalInfo);

// Update personal info
router.put('/', protect, updatePersonalInfo);

module.exports = router;
