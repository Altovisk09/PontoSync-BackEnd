const { collection, addDoc, doc, deleteDoc, getDocs } = require('firebase/firestore');

class SecurityQuestions {
    constructor() {
        this.questionsCollectionRef = collection('securityQuestions');
    }

    async addQuestion(questionText) {
        try {
            const newQuestion = { questionText };
            const docRef = await addDoc(this.questionsCollectionRef, newQuestion);
            return { id: docRef.id, ...newQuestion };
        } catch (error) {
            console.error("Erro ao adicionar pergunta de segurança: ", error);
            return null;
        }
    }

    async removeQuestion(questionId) {
        try {
            await deleteDoc(doc(this.questionsCollectionRef, questionId));
            return true;
        } catch (error) {
            console.error("Erro ao remover pergunta de segurança: ", error);
            return false;
        }
    }

    async listQuestions() {
        try {
            const querySnapshot = await getDocs(this.questionsCollectionRef);
            const questions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return questions;
        } catch (error) {
            console.error("Erro ao listar perguntas de segurança: ", error);
            return [];
        }
    }
}

module.exports = SecurityQuestions;
