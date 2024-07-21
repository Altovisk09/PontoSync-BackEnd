const Users = require('../models/Users');

async function getUser(req, res) {
    try {
        const userId = req.user.token; 
        const user = new Users();
        const userDoc = await user.getUserById(userId);

        if (!userDoc.exists) {
            return res.status(404).send('Usuário não encontrado');
        }

        const userData = {
            ...userDoc.data(),
            uid: userId
        };

        res.status(200).json({ userData });
    } catch (error) {
        console.error('Erro ao obter dados do usuário:', error);
        res.status(500).send('Erro ao obter dados do usuário');
    }
}

module.exports = { getUser };
