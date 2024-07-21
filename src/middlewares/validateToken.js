const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: 'Acesso não autorizado' });
        }

        const [jwtToken, encryptedUserId] = token.split(':');
        if (!jwtToken || !encryptedUserId) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        try {
            jwt.verify(jwtToken, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: 'Token JWT inválido' });
        }

        req.user = {
            encryptedUserId: encryptedUserId,
            jwtToken: jwtToken,
        };

        next();
    } catch (error) {
        console.error('Erro no middleware de autenticação:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

module.exports = authMiddleware;
