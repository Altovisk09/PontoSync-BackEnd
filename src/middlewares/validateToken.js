const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('Token não fornecido');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).send('Formato de token inválido');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send('Token inválido');
        }

        req.user = decoded;
        next();
    });
};

module.exports = validateToken;
