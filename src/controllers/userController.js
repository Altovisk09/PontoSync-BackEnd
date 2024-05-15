const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

const createUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({ message: 'Nome e email são campos obrigatórios.' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Email inválido.' });
        }
        
        const newUser = {
            name, 
            email
        };

        let users = [];
        try {
            const usersData = fs.readFileSync(usersFilePath, 'utf8');
            users = JSON.parse(usersData);
        } catch (error) {
        }

        users.push(newUser);

        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const usersData = fs.readFileSync(usersFilePath, 'utf8');
        const users = JSON.parse(usersData);
        
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

module.exports = {
    createUser,
    getUsers
};
