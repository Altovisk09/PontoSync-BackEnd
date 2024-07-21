const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).send('Token não fornecido');
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
