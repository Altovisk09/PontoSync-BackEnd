const processExtractedText = require('../utils/pdfExtract')
const EmployeeManager = require('../models/Employees');
const path = require('path');
const fs = require('fs')

const isProduction = process.env.NODE_ENV === 'production';

// Define o diretório de uploads apropriado com base no ambiente
const uploadsDir = isProduction ? '/tmp/uploads' : path.join(__dirname, '../uploads');

const addEmployee = async (req, res) => {
    try {
        const employeeManager = new EmployeeManager();

        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo foi enviado.' });
        }

        const filePath = path.join(uploadsDir, req.file.filename);
        console.log(`Arquivo sendo processado: ${filePath}`);

        const employeeData = await processExtractedText(filePath);

        // Use a instância de employeeManager para adicionar o funcionário
        await employeeManager.addEmployee(req, employeeData);

        if (!isProduction) {
          try {
            fs.unlinkSync(filePath);
          } catch (err) {
            console.error('Erro ao deletar o arquivo:', err);
          }
        }

        res.status(200).send('Operação concluída');
    } catch (error) {
        console.error('Erro ao adicionar funcionário:', error);
        res.status(500).json({ error: 'Erro ao adicionar funcionário.' });
    }
};


const updateEmployee = async (req, res) => {
    try {
        const employeeManager = new EmployeeManager();
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
        const employeeManager = new EmployeeManager();
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
        const employeeManager = new EmployeeManager();
        const employees = await employeeManager.listEmployees();
        res.json(employees);
    } catch (error) {
        console.error('Erro ao listar funcionários:', error);
        res.status(500).json({ error: 'Erro ao listar funcionários.' });
    }
};

const getEmployee = async (req, res) => {
    try {
        const employeeManager = new EmployeeManager();
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

const getEmployeesByIds = async (req, res) => {
    try {
        const employeeManager = new EmployeeManager();
        const employeeIds = req.body.repsId;
        const employees = await employeeManager.getEmployeesByIds(employeeIds);
        if (employees.length > 0) {
            res.json(employees);
        } else {
            res.status(404).json({ error: 'Nenhum funcionário encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao obter funcionários:', error);
        res.status(500).json({ error: 'Erro ao obter funcionários.' });
    }
};


const getEmployeesByTeamLeader = async (req, res) => {
    try {
        const employeeManager = new EmployeeManager();
        const { encryptedUserId } = req.user;
        const userId = decrypt(encryptedUserId);
        const employees = await employeeManager.getEmployeesByTeamLeader(userId);
        if (employees) {
            res.json(employees);
        } else {
            res.status(404).json({ error: 'Funcionários não encontrados.' });
        }
    } catch (error) {
        console.error('Erro ao obter funcionário:', error);
        res.status(500).json({ error: 'Erro ao obter funcionário.' });
    }
}
module.exports = {
    addEmployee,
    updateEmployee,
    deleteEmployee,
    listEmployees,
    getEmployee,
    getEmployeesByIds,
    getEmployeesByTeamLeader
};
