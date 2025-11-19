const Usuario = require("./Usuario.class");
const pool = require("../../config/db");
class Admin extends Usuario{
    constructor(
        usuario_id,
        usuario_email
    ) {
        super(usuario_id);
        super(usuario_email);
        this.usuario_id    = usuario_id;
        this.usuario_email = usuario_email;
    }

    static async cadastrar(usuario_id, usuario_email, connection = pool) {
        try {
            const [result] = await connection.query(
                "INSERT INTO admin (usuario_id, usuario_email) VALUES (?, ?)",
                [usuario_id, usuario_email]
            );
            return { id: result.insertId, usuario_id, usuario_email };
        } catch (err) {
            console.error("Erro ao cadastrar admin:", err.sqlMessage || err.message);
            throw new Error("Erro ao cadastrar admin: " + (err.sqlMessage || err.message));
        }
    }

    static async listar() {
        const [rows] = await pool.query("SELECT * FROM admins");
        return rows;
    }

    static async editarMaterial(idMaterial, dados) {
        const { titulo, materia, tema, subtema, arquivo } = dados;

        let query = "UPDATE material SET titulo = ?, materia = ?, tema = ?, subtema = ?";
        const values = [titulo, materia, tema, subtema];

        if (arquivo) {
            query += ", arquivo = ?";
            values.push(arquivo);
        }

        query += " WHERE id = ?";
        values.push(idMaterial);

        await pool.query(query, values);
        return true;
    }

    // Deleta um material pelo ID
    static async deletarMaterial(idMaterial) {
        const query = "DELETE FROM material WHERE id = ?";
        await pool.query(query, [idMaterial]);
        return true;
    }
} 

module.exports = Admin;