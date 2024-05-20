const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require('firebase-admin/firestore');

class Users {
    constructor(name, last_name, phone_number, security_question, response) {
        this.name = name;
        this.last_name = last_name;
        this.phone_number = phone_number;
        this.security_question = security_question;
        this.response = response;
        this.employees = [];
    }

    async createNewUser(email, password) {
        try {
            const auth = getAuth();
            const userRecord = await auth.createUser({
                email: email,
                password: password,
                displayName: `${this.name} ${this.last_name}`,
                phoneNumber: this.phone_number,
                emailVerified: false,
                disabled: false
            });
            const userId = userRecord.uid;
            
            await this.addToFireStore(userId);
            
            console.log('Usuário criado com sucesso!');
            return; // Retorne o ID do usuário criado
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw error;
        }
    }
    async addToFireStore(userId) {
        try{
            const db = getFirestore();
        const userRef = db.collection("users").doc(userId);

        await userRef.set({
            name: this.name,
            last_name: this.last_name,
            phone_number: this.phone_number,
            security_question: this.security_question,
            response: this.response
        })

        console.log('Informações do usuario adicionadas ao Firestore!')
        }catch(error){
            console.error('Erro ao adicionar informações do usuário ao Firestore:', error);
        }
    }
}

module.exports = Users;
