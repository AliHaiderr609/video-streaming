const express = require('express');
const router = express.Router();
const { signup, login, getProfile, updateProfile } = require('../controller/authController');
const { upload } = require('../services/api');
const authenticate = require('../services/api').authenticate;

// Signup
router.post('/signup', signup);

// Login
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.put('/update', authenticate, upload.single('avatarUrl'), updateProfile);

module.exports = router;
