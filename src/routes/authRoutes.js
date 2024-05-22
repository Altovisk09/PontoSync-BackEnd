const express = require('express');
const router = express.Router();
const { createUser, login } = require('../controllers/authController');

router.post("/create-user", createUser);
router.post("/auth", login)

module.exports = router;
