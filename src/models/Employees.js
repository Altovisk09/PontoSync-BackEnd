const { collection, addDoc, doc, updateDoc, deleteDoc, getDocs } = require('firebase/firestore');

class EmployeeManager {
    constructor() {
        this.employeeCollectionRef = collection('employee');
    }

    async addEmployee(employeeData) {
        try {
            const docRef = await addDoc(this.employeeCollectionRef, employeeData);
            return { id: docRef.id, ...employeeData };
        } catch (error) {
            console.error("Erro ao adicionar funcionário: ", error);
            return null;
        }
    }

    async updateEmployee(employeeId, employeeData) {
        try {
            const employeeDocRef = doc(this.employeeCollectionRef, employeeId);
            await updateDoc(employeeDocRef, employeeData);
            return { id: employeeId, ...employeeData };
        } catch (error) {
            console.error("Erro ao atualizar funcionário: ", error);
            return null;
        }
    }

    async deleteEmployee(employeeId) {
        try {
            const employeeDocRef = doc(this.employeeCollectionRef, employeeId);
            await deleteDoc(employeeDocRef);
            return true;
        } catch (error) {
            console.error("Erro ao excluir funcionário: ", error);
            return false;
        }
    }

    async listEmployees() {
        try {
            const querySnapshot = await getDocs(this.employeeCollectionRef);
            const employees = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return employees;
        } catch (error) {
            console.error("Erro ao listar funcionários: ", error);
            return [];
        }
    }

    async getEmployee(employeeId) {
        try {
            const employeeDocRef = doc(this.employeeCollectionRef, employeeId);
            const employeeSnapshot = await getDoc(employeeDocRef);
            if (employeeSnapshot.exists()) {
                return { id: employeeSnapshot.id, ...employeeSnapshot.data() };
            } else {
                console.error("Funcionário não encontrado");
                return null;
            }
        } catch (error) {
            console.error("Erro ao obter funcionário: ", error);
            return null;
        }
    }
}

module.exports = EmployeeManager;
