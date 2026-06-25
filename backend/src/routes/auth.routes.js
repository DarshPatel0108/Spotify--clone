const express = require('express');
const authController = require("../controllers/auth.controller")
const meController = require("../controllers/me.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const router = express.Router();

router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser)
router.post('/logout', authController.logoutUser)
router.get('/me', authMiddleware.authUser, meController.getCurrentUser)

module.exports = router;