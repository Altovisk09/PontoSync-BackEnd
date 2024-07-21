const Users = require('../models/Users');
const SecurityQuestions = require('../models/SecurityQuestions');

async function createUser(req, res) {
    const { name, last_name, email, password, phone_number, security_question, response } = req.body;
    const user = new Users();

    try {
        await user.createNewUser(email, password, name, last_name, phone_number, security_question, response);
        res.status(200).send('Usuário criado com sucesso!');
    } catch (error) {
        res.status(500).send('Erro ao criar usuário');
    }
}
async function login(req, res) {
    const user = new Users();
    const { idToken, rememberMe } = req.body;
    try {
        const { combinedToken, userData } = await user.login(idToken);

        res.cookie('jwt', combinedToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: rememberMe ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 60,
            sameSite: 'Lax'
        });

        res.status(200).json({ userData });
    } catch (error) {
        res.status(401).send({ message: 'Erro ao autenticar usuário', error: error.message });
    }
}

async function logout(req, res) {
    try {
        res.cookie('jwt', '', { maxAge: 1 }); 
        res.status(200).send('Logout realizado com sucesso');
    } catch (error) {
        res.status(500).send('Erro ao realizar logout');
    }
}

async function addSecurityQuestion(req, res) {
    try {
        const questions = new SecurityQuestions();
        const { questionText } = req.body;
        const newQuestion = await questions.addQuestion(questionText);
        res.status(200).json({ newQuestion });
    } catch (error) {
        console.error('Erro ao adicionar pergunta de segurança:', error);
        res.status(500).json({ error: 'Erro ao adicionar pergunta de segurança.' });
    }
};

async function removeSecurityQuestion(req, res) {
    try {
        const questions = new SecurityQuestions();
        const { questionId } = req.params;
        const success = await questions.removeQuestion(questionId);
        res.status(200).json({ success });
    } catch (error) {
        console.error('Erro ao remover pergunta de segurança:', error);
        res.status(500).json({ error: 'Erro ao remover pergunta de segurança.' });
    }
};

async function listSecurityQuestions(req, res) {
    try {
        const questions = new SecurityQuestions();
        const questionsList = await questions.listQuestions();
        res.json(questionsList);
    } catch (error) {
        console.error('Erro ao listar perguntas de segurança:', error);
        res.status(500).json({ error: 'Erro ao listar perguntas de segurança.' });
    }
};


module.exports = {
    createUser,
    login,
    logout,
    addSecurityQuestion,
    removeSecurityQuestion,
    listSecurityQuestions
};
