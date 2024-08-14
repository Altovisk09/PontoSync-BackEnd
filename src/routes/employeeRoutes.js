const express = require('express');
const router = express.Router();
const verificateToken = require('../middlewares/validateToken');
const { addEmployee, 
    updateEmployee, 
    deleteEmployee, 
    listEmployees, 
    getEmployee, 
    getEmployeesByIds,
    getEmployeesByTeamLeader } = require('../controllers/employeeController');

router.route('/')
    .get(verificateToken, getEmployeesByIds)
    .post(verificateToken, addEmployee)

router.route('/:employeeId')    
    .put(verificateToken, updateEmployee)
    .delete(verificateToken, deleteEmployee)

router.route('/employee')
    .get(verificateToken, getEmployee)

router.route('/all')
    .get(verificateToken, listEmployees)

module.exports = router;