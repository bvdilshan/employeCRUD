const express = require('express');
const router = express.Router();
const { 
    getEmployees, 
    createEmployee, 
    updateEmployee,
    deleteEmployee
} = require('../controllers/employeeController');
const verifyToken = require('../middleware/authMiddleware');


router.get('/', getEmployees);
router.post('/add', verifyToken, createEmployee);
router.put('/:id', verifyToken, updateEmployee);
router.delete('/:id', verifyToken, deleteEmployee);
module.exports = router;