const express = require('express');
const { createUser, getUsers } = require('../controllers/userController');

const router = express.Router();

router.route('/users')
    .get(getUsers)
    .post(createUser);

module.exports = router;
