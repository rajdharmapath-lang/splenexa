const express = require('express');
const { requireAuth } = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.use(requireAuth);
router.get('/me', userController.getMe);
router.patch('/profile', userController.updateProfile);

module.exports = router;
