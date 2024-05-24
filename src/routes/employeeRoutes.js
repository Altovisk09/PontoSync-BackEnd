const express = require('express');
const router = express.Router();
const { addEmployee, updateEmployee, deleteEmployee, listEmployees, getEmployee } = require('../controllers/employeeController');

router.route('/')
    .get(listEmployees)
    .post(addEmployee)

router.route('/:employeeId')    
    .put(updateEmployee)
    .delete(deleteEmployee)

router.route('/employee')
    .get(getEmployee)

module.exports = router;