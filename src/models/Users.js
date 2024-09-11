const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require('firebase-admin/firestore');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const { encrypt } = require('../utils/crypto');

dotenv.config();

class Users {
    constructor() {
      this.db = getFirestore();
      this.usersCollectionRef = this.db.collection("users");
    }

    async createNewUser(email, password, name, last_name, phone_number, security_question, response) {
        try {
            const auth = getAuth();
            const userRecord = await auth.createUser({
                email: email,
                password: password,
                displayName: `${name} ${last_name}`,
                phoneNumber: phone_number,
                emailVerified: false,
                disabled: false
            });
            const userId = userRecord.uid;
            
            await this.addToFireStore(userId, name, last_name, phone_number, security_question, response);

            console.log('Usuário criado com sucesso!');
            return userId; 
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw error;
        }
    }

    async addToFireStore(userId, name, last_name, phone_number, security_question, response) {
        try {
            const userRef = this.usersCollectionRef.doc(userId);

            await userRef.set({
                name: name,
                last_name: last_name,
                phone_number: phone_number,
                security_question: security_question,
                response: response
            });

            console.log('Informações do usuário adicionadas ao Firestore!');
        } catch (error) {
            console.error('Erro ao adicionar informações do usuário ao Firestore:', error);
            throw error;
        }
    }

        async login(idToken) {
            try {
                const decodedToken = await getAuth().verifyIdToken(idToken);
        
                if (decodedToken) {
                    // const randomToken = crypto.randomBytes(16).toString('hex');
                    const token = jwt.sign({ token: idToken }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
                    const userId = decodedToken.uid;
                    const userDoc = await this.usersCollectionRef.doc(userId).get();
        
                    if (!userDoc.exists) {
                        throw new Error('Usuário não encontrado');
                    }
        
                    const userData = {
                        ...userDoc.data(),
                        email: decodedToken.email,
                    };
                    const encryptedUserId = encrypt(userId);
                    const combinedToken = `${token}:${encryptedUserId}`;
        
                    return { combinedToken, userData };
                } else {
                    throw new Error('Token inválido');
                }
            } catch (error) {
                console.error('Erro ao verificar o ID Token:', error);
                throw error;
            }
        }    
        async getUserById(userId) {
            try {
                const userDoc = await this.usersCollectionRef.doc(userId).get();
                return userDoc;
            } catch (error) {
                console.error('Erro ao obter usuário:', error);
                throw new Error('Erro ao obter usuário');
            }
        }
    }

module.exports = Users;
