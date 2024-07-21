const express = require('express');
const router = express.Router();
const verificateToken = require('./src/middlewares/validateToken');
const { getUser } = require('../controllers/userController');

router.route('/')
    .get(verificateToken, getUser);

module.export = router;