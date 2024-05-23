const Users = require('../models/Users');
const SecurityQuestions = require('../models/SecurityQuestions');

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
async function login(req, res) {
    const { idToken } = req.body;

    try {
        const token = await Users.login(idToken);
        res.status(200).json({ token });
    } catch (error) {
        res.status(401).send({ message: 'Erro ao autenticar usuário', error: error.message });
    }
}

async function addSecurityQuestion (req, res) {
    try {
        const { questionText } = req.body;
        const newQuestion = await SecurityQuestions.addQuestion(questionText);
        res.status(200).json({ newQuestion });
    } catch (error) {
        console.error('Erro ao adicionar pergunta de segurança:', error);
        res.status(500).json({ error: 'Erro ao adicionar pergunta de segurança.' });
    }
};

async function removeSecurityQuestion(req, res)  {
    try {
        const { questionId } = req.params;
        const success = await SecurityQuestions.removeQuestion(questionId);
        res.status(200).json({ success });
    } catch (error) {
        console.error('Erro ao remover pergunta de segurança:', error);
        res.status(500).json({ error: 'Erro ao remover pergunta de segurança.' });
    }
};

async function listSecurityQuestions(req, res) {
    try {
        const questions = await SecurityQuestions.listQuestions();
        res.json(questions);
    } catch (error) {
        console.error('Erro ao listar perguntas de segurança:', error);
        res.status(500).json({ error: 'Erro ao listar perguntas de segurança.' });
    }
};


module.exports = {
    createUser,
    login,
    addSecurityQuestion,
    removeSecurityQuestion,
    listSecurityQuestions
};
