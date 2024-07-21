const express = require('express');
const router = express.Router();
const verificateToken = require('../middlewares/validateToken');
const { addEmployee, updateEmployee, deleteEmployee, listEmployees, getEmployee } = require('../controllers/employeeController');

router.route('/')
    .get(verificateToken, listEmployees)
    .post(verificateToken, addEmployee)

router.route('/:employeeId')    
    .put(verificateToken, updateEmployee)
    .delete(verificateToken, deleteEmployee)

router.route('/employee')
    .get(verificateToken, getEmployee)

module.exports = router;