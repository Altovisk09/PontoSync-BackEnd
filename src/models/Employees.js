const { getFirestore } = require('firebase-admin/firestore');

class EmployeeManager {
    constructor() {
        this.db = getFirestore();
        this.employeeCollectionRef = this.db.collection('employees');
    }

    async addEmployee(employeeData) {
        try {
            const res = await this.employeeCollectionRef.add(employeeData);
            return res.id;
        } catch (error) {
            throw new Error('Erro ao adicionar funcionário: ' + error.message);
        }
    }

    async getEmployeeById(employeeId) {
        try {
            const doc = await this.employeeCollectionRef.doc(employeeId).get();
            if (doc.exists) {
                return doc.data();
            } else {
                throw new Error('Funcionário não encontrado');
            }
        } catch (error) {
            throw new Error('Erro ao buscar funcionário: ' + error.message);
        }
    }

    async updateEmployee(employeeId, updatedData) {
        try {
            await this.employeeCollectionRef.doc(employeeId).update(updatedData);
            return true;
        } catch (error) {
            throw new Error('Erro ao atualizar funcionário: ' + error.message);
        }
    }

    async deleteEmployee(employeeId) {
        try {
            await this.employeeCollectionRef.doc(employeeId).delete();
            return true;
        } catch (error) {
            throw new Error('Erro ao deletar funcionário: ' + error.message);
        }
    }

    async getAllEmployees() {
        try {
            const snapshot = await this.employeeCollectionRef.get();
            const employees = [];
            snapshot.forEach(doc => {
                employees.push({ id: doc.id, ...doc.data() });
            });
            return employees;
        } catch (error) {
            throw new Error('Erro ao buscar todos os funcionários: ' + error.message);
        }
    }
}

module.exports = EmployeeManager;
