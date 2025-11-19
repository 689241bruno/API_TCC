const PlanoDeEstudos = require('../models/objetos/PlanoDeEstudos.class');

exports.listarTarefas = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const tarefas = await PlanoDeEstudos.listar(usuario_id);
        res.json(tarefas);
    } catch (err) {
        console.error("Erro ao listar plano de estudos: ", err);
        res.status(500).json({ erro: "Erro ao listar plano de estudos!" });
    }
};

exports.criarTarefa = async (req, res) => {
    try {
        const { usuario_id, dia, materia, tema, inicio, termino } = req.body;

        if (!usuario_id || !dia || !materia || !tema || !inicio || !termino) {
            return res.status(400).json({ erro: "Preencha todos os campos obrigatórios!" });
        }

        const novoId = await PlanoDeEstudos.criar({ usuario_id, dia, materia, tema, inicio, termino });
        res.status(201).json({ mensagem: "Tarefa adicionada com sucesso!", id: novoId });
    } catch (err) {
        console.error("Erro ao criar tarefa: ", err);
        res.status(500).json({ erro: "Erro ao criar tarefa!" });
    }
};

exports.editarTarefa = async (req, res) => {
    try {
        const { id } = req.params;
        const dados = req.body;
        
        await PlanoDeEstudos.editar(id, dados);
        res.json({ mensagem: "Tarefa atualizada com sucesso!" });
    } catch (err) {
        console.error("Erro ao editar tarefa: ", err);
        res.status(500).json({ erro: "Erro ao editar tarefa!" });
    }
};

exports.deletarTarefa = async (req, res) => {
    try {
        const { id } = req.params;
        await PlanoDeEstudos.deletar(id);
        res.json({ mensagem: "Tarefa deletada com sucesso!" });
    } catch (err) {
        console.error("Erro ao deletar tarefa: ", err);
        res.status(500).json({ erro: "Erro ao deletar tarefa!" });
    }
};
