const express = require('express');
const router = express.Router();
const verificateToken = require('../middlewares/validateToken');
const { getUser } = require('../controllers/userController');

router.route('/')
    .get(getUser);

module.exports = router;