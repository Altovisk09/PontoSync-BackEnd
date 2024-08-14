const { getFirestore, FieldValue} = require('firebase-admin/firestore');
const { decrypt } = require('../utils/crypto');

class EmployeeManager {
    constructor() {
        this.db = getFirestore();
        this.employeeCollectionRef = this.db.collection('employees');
    }

    async addEmployee(req, employeeData, ) {
        try {
            const { encryptedUserId } = req.user;
            const userId = decrypt(encryptedUserId);
            const EmployeeRef = this.employeeCollectionRef.doc(employeeData.matricula);
           
            const existingEmployee = await EmployeeRef.get();
            if (existingEmployee.exists) {
                throw new Error('Funcionário já cadastrado com outro líder de equipe.');
            }

            await EmployeeRef.set({
                teamLeader: userId,
                agencie: employeeData.agencia,
                nome: employeeData.nome ,
                pis: employeeData.pis,
                cpf: employeeData.cpf,
                admissao: employeeData.admissao,
                departamento: employeeData.departamento,
                cargo: employeeData.cargo,
                horasMensais: employeeData.horasMensais,
                bancoHoras: employeeData.bancoHoras,
                adicNot: employeeData.adicNot,
                extra100: employeeData.compensacao100,
                extra: employeeData.compensacao,
                totalWorkedHours: employeeData.totalWorkedHours,
                timeEntries:employeeData.timeEntries
            })

            const userRef = this.db.collection('users').doc(userId);
            await userRef.update({
                repsId: FieldValue.arrayUnion(employeeData.matricula) 
            });

             console.log('Operação concluida, funcionario adicionado')
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

    async getEmployeesByIds(employeeIds) {
        try {
            const employees = [];
            for (const employeeId of employeeIds) {
                const employeeDoc = await this.employeeCollectionRef.doc(employeeId).get();
                if (employeeDoc.exists) {
                    const employeeData = employeeDoc.data();
                    const { timeEntries, ...employeeInfo } = employeeData; // Exclui timeEntries
                    employees.push({ id: employeeId, ...employeeInfo });
                }
            }
            return employees;
        } catch (error) {
            throw new Error('Erro ao buscar funcionários: ' + error.message);
        }
    }
    

    //para sup
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
    async getEmployeesByTeamLeader(userId) {
        try {
            const userDoc = await this.db.collection('users').doc(userId).get();
            if (!userDoc.exists) {
                throw new Error('Líder de equipe não encontrado');
            }
    
            const employeeIds = userDoc.data().employeeIds || [];
            const employees = [];
    
            for (const employeeId of employeeIds) {
                const employeeDoc = await this.employeeCollectionRef.doc(employeeId).get();
                if (employeeDoc.exists) {
                    employees.push({ id: employeeId, ...employeeDoc.data() });
                }
            }
    
            return employees;
        } catch (error) {
            throw new Error('Erro ao buscar funcionários: ' + error.message);
        }
    }
    
}

module.exports = EmployeeManager;
