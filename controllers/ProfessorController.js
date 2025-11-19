const Professor = require("../models/usuarios/Professor.class");

exports.listarProfessores = async (req, res) => {
    try {
        const professores = await Professor.listar();
        res.json(professores);
    } catch (err) {
        console.error("Erro ao listar professores:", err);
        res.status(500).json({ erro: "Erro ao listar professores!" });
    }
};

exports.cadastrarProfessor = async (req, res) => {
    try {
        const { usuario_id, materia } = req.body;

        const pool = require("../config/db");
        const connection = await pool.getConnection();

        const result = await Professor.cadastrar(usuario_id, materia || null, connection);
        connection.release();

        res.status(201).json({
            mensagem: "Professor cadastrado com sucesso!",
            result
        });
    } catch (err) {
        console.error("Erro ao cadastrar professor:", err);
        res.status(500).json({ erro: "Erro ao cadastrar professor!" });
    }
};

exports.editarProfessor = async (req, res) => {
    const { id } = req.params;
    const { materia } = req.body;

    const pool = require("../config/db");
    const connection = await pool.getConnection();

    try {
        if (!materia) throw new Error("Matéria não informada.");

        await connection.query(
            "UPDATE professores SET materia = ? WHERE usuario_id = ?",
            [materia, id]
        );

        connection.release();
        res.json({ mensagem: "Professor atualizado com sucesso!" });
    } catch (err) {
        connection.release();
        console.error("Erro ao editar professor:", err);
        res.status(500).json({ erro: "Erro ao editar professor!" });
    }
};

exports.deletarProfessor = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        console.log("Requisição deletarProfessor:", { usuario_id });

        await Professor.deletar(usuario_id);
        res.json({ mensagem: "Professor deletado com sucesso!" });
    } catch (err) {
        console.error("Erro ao deletar professor:", err);
        res.status(500).json({ erro: "Erro ao deletar professor." });
    }
};