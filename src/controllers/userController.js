const Users = require('../models/Users');
const { getAuth } = require('firebase-admin/auth');
const { decrypt } = require('../utils/crypto');

async function getUser(req, res) {
    try {
        const { encryptedUserId } = req.user;

        const userId = decrypt(encryptedUserId);

        const userRecord = await getAuth().getUser(userId);
        const email = userRecord.email;

        const user = new Users();
        const userDoc = await user.getUserById(userId);

        if (!userDoc.exists) {
            return res.status(404).send('Usuário não encontrado');
        }

        const userData = {
            ...userDoc.data(),
            email,
        };

        res.status(200).json({ userData });
    } catch (error) {
        console.error('Erro ao obter dados do usuário:', error);
        res.status(500).send('Erro ao obter dados do usuário');
    }
}

module.exports={ getUser }