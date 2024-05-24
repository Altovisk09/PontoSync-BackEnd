const { getFirestore } = require('firebase-admin/firestore');

class Agencies {
    constructor() {
        this.db = getFirestore();
        this.agenciesCollectionRef = this.db.collection('agencies');
    }

    async addAgency(name, responsaveis) {
        try {
            const newAgency = { name, responsaveis };
            const docRef = await this.agenciesCollectionRef.add(newAgency);
            return { id: docRef.id, ...newAgency };
        } catch (error) {
            console.error("Erro ao adicionar agência: ", error);
            return null;
        }
    }

    async removeAgency(agencyId) {
        try {
            await this.agenciesCollectionRef.doc(agencyId).delete();
            return true;
        } catch (error) {
            console.error("Erro ao remover agência: ", error);
            return false;
        }
    }

    async listAgencies() {
        try {
            const querySnapshot = await this.agenciesCollectionRef.get();
            const agencies = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return agencies;
        } catch (error) {
            console.error("Erro ao listar agências: ", error);
            return [];
        }
    }

    async addResponsavel(agencyId, responsavelData) {
        try {
            await this.agenciesCollectionRef.doc(agencyId).update({
                responsaveis: getFirestore.FieldValue.arrayUnion(responsavelData)
            });
            return true;
        } catch (error) {
            console.error("Erro ao adicionar responsável: ", error);
            return false;
        }
    }

    async removeResponsavel(agencyId, responsavelData) {
        try {
            await this.agenciesCollectionRef.doc(agencyId).update({
                responsaveis: getFirestore.FieldValue.arrayRemove(responsavelData)
            });
            return true;
        } catch (error) {
            console.error("Erro ao remover responsável: ", error);
            return false;
        }
    }
}

module.exports = Agencies;
