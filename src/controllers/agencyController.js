const Agencies = require('../models/Agencies');

const agencies = new Agencies();

const addAgency = async (req, res) => {
    try {
        const { name } = req.body;
        const newAgency = await agencies.addAgency(name);
        res.json(newAgency);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar agência.' });
    }
};

const removeAgency = async (req, res) => {
    try {
        const { agencyId } = req.params;
        const success = await agencies.removeAgency(agencyId);
        if (success) {
            res.json({ message: 'Agência removida com sucesso.' });
        } else {
            res.status(404).json({ error: 'Agência não encontrada.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover agência.' });
    }
};

const listAgencies = async (req, res) => {
    try {
        const allAgencies = await agencies.listAgencies();
        res.json(allAgencies);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar agências.' });
    }
};

const addRep = async (req, res) => {
    try {
        const {name, number, email} = req.body;

        const repData = {
            name: name ,
            number: number,
            email: email
        };

        await agencies.addResponsavel(repData)
        res.status(200).json({message: `Funcionario ${name} adicionado com sucesso`})

    }catch(error){
        res.status(500).json({ error: 'Erro ao adicionar responsável da agencia.' });
    }
}
module.exports = { addAgency, removeAgency, listAgencies };
