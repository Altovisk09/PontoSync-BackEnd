const EmployeeManager = require('./EmployeeManager');

const employeeManager = new EmployeeManager();

const addEmployee = async (req, res) => {
    try {
        const employeeData = req.body;
        const newEmployee = await employeeManager.addEmployee(employeeData);
        res.json(newEmployee);
    } catch (error) {
        console.error('Erro ao adicionar funcionário:', error);
        res.status(500).json({ error: 'Erro ao adicionar funcionário.' });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const employeeData = req.body;
        const updatedEmployee = await employeeManager.updateEmployee(employeeId, employeeData);
        if (updatedEmployee) {
            res.json(updatedEmployee);
        } else {
            res.status(404).json({ error: 'Funcionário não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao atualizar funcionário:', error);
        res.status(500).json({ error: 'Erro ao atualizar funcionário.' });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const success = await employeeManager.deleteEmployee(employeeId);
        if (success) {
            res.json({ message: 'Funcionário excluído com sucesso.' });
        } else {
            res.status(404).json({ error: 'Funcionário não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao excluir funcionário:', error);
        res.status(500).json({ error: 'Erro ao excluir funcionário.' });
    }
};

const listEmployees = async (req, res) => {
    try {
        const employees = await employeeManager.listEmployees();
        res.json(employees);
    } catch (error) {
        console.error('Erro ao listar funcionários:', error);
        res.status(500).json({ error: 'Erro ao listar funcionários.' });
    }
};

const getEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const employee = await employeeManager.getEmployee(employeeId);
        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({ error: 'Funcionário não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao obter funcionário:', error);
        res.status(500).json({ error: 'Erro ao obter funcionário.' });
    }
};

module.exports = { addEmployee, updateEmployee, deleteEmployee, listEmployees, getEmployee };
