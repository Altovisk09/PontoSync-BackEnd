const express = require('express');
const router = express.Router();
const { addAgency, removeAgency, listAgencies } = require('../controllers/agencyController');

router.route('/')
    .get(listAgencies)
    .post(addAgency)
    .delete(removeAgency)

module.exports = router;