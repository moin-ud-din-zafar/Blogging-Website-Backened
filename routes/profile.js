// routes/profile.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getProfile } = require('../controllers/profileController');

// GET /api/profile/me — returns { user: {...}, posts: [...] }
router.get('/me', auth, getProfile);

module.exports = router;
