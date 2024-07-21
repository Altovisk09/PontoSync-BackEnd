const express = require('express');
const router = express.Router();
const verificateToken = require('./src/middlewares/validateToken');
const { createUser, login, logout, addSecurityQuestion, removeSecurityQuestion, listSecurityQuestions } = require('../controllers/authController');

router.route("/create-user")
    .post(createUser);

router.route("/auth")
    .post(login);

router.route("/logout")
    .post(verificateToken, logout);

router.route('/question')
    .post(verificateToken, addSecurityQuestion)
    .delete(verificateToken, removeSecurityQuestion)
    .get(verificateToken, listSecurityQuestions)
    
module.exports = router;
