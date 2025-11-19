const Desafios = require("../models/objetos/Desafios.class");

exports.listarDesafios = async (req, res) => {
    try {
        const desafios = await Desafios.listar();
        res.json(desafios);
    } catch (err) {
        console.error("Erro ao listar desafios!");
        res.status(500).json({ erro: "Erro ao listar desafios!"});
    }
};

exports.criarDesafio = async (req, res) => {
    try {
        const { titulo, descricao, xp, img } = req.body;
        if (!titulo) return res.status(400).json({ erro: "Título é obrigatório" });

        const id = await Desafios.criar({ titulo, descricao, xp, img });
        res.status(201).json({ mensagem: "Desafio criado", id });
    } catch (err) {
        console.error("Erro ao criar desafio:", err);
        res.status(500).json({ erro: "Erro ao criar desafio" });
    }
};

exports.editarDesafio = async (req, res) => {
    try {
        const { id } = req.params;
        await Desafios.editar(id, req.body);
        res.json({ mensagem: "Desafio atualizado" });
    } catch (err) {
        console.error("Erro ao editar desafio:", err);
        res.status(500).json({ erro: "Erro ao editar desafio" });
    }
};

exports.deletarDesafio = async (req, res) => {
    try {
        const { id } = req.params;
        await Desafios.deletar(id);
        res.json({ mensagem: "Desafio deletado" });
    } catch (err) {
        console.error("Erro ao deletar desafio:", err);
        res.status(500).json({ erro: "Erro ao deletar desafio" });
    }
};

// Progresso
exports.registrarProgresso = async (req, res) => {
    try {
        const { usuario_id, desafio_id, progresso, concluida } = req.body;
        if (!usuario_id || !desafio_id) return res.status(400).json({ erro: "usuario_id e desafio_id são obrigatórios" });

        await Desafios.registrarProgresso(usuario_id, desafio_id, progresso, concluida);
        res.json({ mensagem: "Progresso registrado" });
    } catch (err) {
        console.error("Erro ao registrar progresso:", err);
        res.status(500).json({ erro: "Erro ao registrar progresso" });
    }
};

exports.listarProgressoUsuario = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const progresso = await Desafios.listarProgresso(usuario_id);
        res.json(progresso);
    } catch (err) {
        console.error("Erro ao listar progresso:", err);
        res.status(500).json({ erro: "Erro ao listar progresso do usuário" });
    }
};

exports.marcarConcluida = async (req, res) => {
    try {
        const { usuario_id, desafio_id } = req.body;
        if (!usuario_id || !desafio_id) return res.status(400).json({ erro: "usuario_id e desafio_id são obrigatórios" });

        await Desafios.marcarConcluida(usuario_id, desafio_id);
        res.json({ mensagem: "Desafio concluído!" });
    } catch (err) {
        console.error("Erro ao concluir desafio:", err);
        res.status(500).json({ erro: "Erro ao concluir desafio!" });
    }
};