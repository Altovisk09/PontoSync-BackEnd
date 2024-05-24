const { getFirestore } = require('firebase/firestore');

class SecurityQuestions {
    constructor() {
        this.db = getFirestore();
        this.questionsCollectionRef = this.db.collection('securityQuestions');
    }

    async addQuestion(questionText) {
        try {
            const newQuestion = { questionText };
            const docRef = await this.questionsCollectionRef.add(newQuestion);
            return { id: docRef.id, ...newQuestion };
        } catch (error) {
            console.error("Erro ao adicionar pergunta de segurança: ", error);
            return null;
        }
    }

    async removeQuestion(questionId) {
        try {
            await this.questionsCollectionRef.doc(questionId).delete();
            return true;
        } catch (error) {
            console.error("Erro ao remover pergunta de segurança: ", error);
            return false;
        }
    }

    async listQuestions() {
        try {
            const querySnapshot = await this.questionsCollectionRef.get();
            const questions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return questions;
        } catch (error) {
            console.error("Erro ao listar perguntas de segurança: ", error);
            return [];
        }
    }
}

module.exports = SecurityQuestions;
