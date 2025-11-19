const Admin = require("../models/usuarios/Admin.class");

exports.cadastrarAdmin = async (req, res) => {
    try {
        const { usuario_id, usuario_email } = req.body;

        const pool = require("../config/db");
        const connection = await pool.getConnection();

        const result = await Admin.cadastrar(usuario_id, usuario_email, connection);
        connection.release();

        res.status(201).json({
        mensagem: "Administrador cadastrado com sucesso!",
        result
        });
    } catch (err) {
        console.error("Erro ao cadastrar admin:", err);
        res.status(500).json({ erro: "Erro ao cadastrar admin!" });
    }
};

exports.listarAdmins = async (req, res) => {
    try {
        const admins = await Admin.listar();
        res.json(admins);
    } catch (err) {
        console.error("Erro ao listar admins:", err);
        res.status(500).json({ erro: "Erro ao listar administradores!" });
    }
}; 

exports.editarMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, materia, tema, subtema } = req.body;
        const arquivo = req.file ? req.file.filename : null;

        await Admin.editarMaterial(id, { titulo, materia, tema, subtema, arquivo });

        res.json({ mensagem: "Material atualizado com sucesso!" });
    } catch (err) {
        console.error("Erro ao editar material:", err);
        res.status(500).json({ erro: "Erro ao editar material!" });
    }
};

exports.deletarMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        await Admin.deletarMaterial(id);
        res.json({ mensagem: "Material excluído com sucesso!" });
    } catch (err) {
        console.error("Erro ao deletar material:", err);
        res.status(500).json({ erro: "Erro ao deletar material!" });
    }
};