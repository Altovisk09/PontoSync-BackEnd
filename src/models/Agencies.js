const { collection, addDoc, deleteDoc, doc, getDocs } = require('firebase/firestore');

class Agencies {
    constructor() {
        this.agenciesCollectionRef = collection('agencies');
    }

    async addAgency(name) {
        try {
            const newAgency = { name };
            const docRef = await addDoc(this.agenciesCollectionRef, newAgency);
            return { id: docRef.id, ...newAgency };
        } catch (error) {
            console.error("Erro ao adicionar agência: ", error);
            return null;
        }
    }

    async removeAgency(agencyId) {
        try {
            const agencyDocRef = doc(this.agenciesCollectionRef, agencyId);
            const responsiblesCollectionRef = collection(agencyDocRef, 'responsaveis');
            const responsiblesSnapshot = await getDocs(responsiblesCollectionRef);
            responsiblesSnapshot.forEach(async (responsibleDoc) => {
                await deleteDoc(doc(responsiblesCollectionRef, responsibleDoc.id));
            });
            await deleteDoc(agencyDocRef);
        } catch (error) {
            console.error("Erro ao remover agência: ", error);
        }
    }

    async listAgencies() {
        try {
            const querySnapshot = await getDocs(this.agenciesCollectionRef);
            const agencies = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return agencies;
        } catch (error) {
            console.error("Erro ao listar agências: ", error);
            return [];
        }
    }

    async addColaborator(agencyId, name, number, email) {
        try {
            const agencyDocRef = doc(this.agenciesCollectionRef, agencyId);
            const responsiblesCollectionRef = collection(agencyDocRef, 'responsaveis');
            const newColaborator = { name, number, email };
            const docRef = await addDoc(responsiblesCollectionRef, newColaborator);
            return { id: docRef.id, ...newColaborator };
        } catch (error) {
            console.error("Erro ao adicionar colaborador: ", error);
            return null;
        }
    }

    async removeColaborator(agencyId, colaboratorId) {
        try {
            const agencyDocRef = doc(this.agenciesCollectionRef, agencyId);
            const responsiblesCollectionRef = collection(agencyDocRef, 'responsaveis');
            await deleteDoc(doc(responsiblesCollectionRef, colaboratorId));
        } catch (error) {
            console.error("Erro ao remover colaborador: ", error);
        }
    }

    async listColaborators(agencyId) {
        try {
            const agencyDocRef = doc(this.agenciesCollectionRef, agencyId);
            const responsiblesCollectionRef = collection(agencyDocRef, 'responsaveis');
            const querySnapshot = await getDocs(responsiblesCollectionRef);
            const responsibles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return responsibles;
        } catch (error) {
            console.error("Erro ao listar colaboradores: ", error);
            return [];
        }
    }
}
module.exports = Agencies;
