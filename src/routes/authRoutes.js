const express = require('express');
const router = express.Router();
const { createUser, login, addSecurityQuestion, removeSecurityQuestion, listSecurityQuestions } = require('../controllers/authController');

router.route("/create-user")
    .post(createUser);

router.route("/auth")
    .post(login);

router.route('/question')
    .post(addSecurityQuestion)
    .delete(removeSecurityQuestion)
    .get(listSecurityQuestions)
    
module.exports = router;
