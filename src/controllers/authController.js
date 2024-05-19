const Users = require('../models/Users');

async function createUser(req, res) {
    const { name, last_name, email, password, phone_number, security_question, response } = req.body;
    const user = new Users(name, last_name, phone_number, security_question, response);
    
    try {
        await user.createNewUser(email, password);
        res.status(200).send('Usuário criado com sucesso!');
    } catch (error) {
        res.status(500).send('Erro ao criar usuário');
    }
}

module.exports = {
    createUser
};
