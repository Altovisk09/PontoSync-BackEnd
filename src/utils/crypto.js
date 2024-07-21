const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.CRYPTO_SECRET, 'hex');
const iv = Buffer.alloc(16, 0); // IV fixo

function encrypt(text) {
    if (key.length !== 32) {
        throw new Error('Chave inválida. A chave deve ter 32 bytes.');
    }
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decrypt(text) {
    if (key.length !== 32) {
        throw new Error('Chave inválida. A chave deve ter 32 bytes.');
    }
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = { encrypt, decrypt };
