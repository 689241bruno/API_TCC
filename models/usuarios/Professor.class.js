const Usuario = require("./Usuario.class");
const connection = require("../../config/db")
class Professor extends Usuario {
    constructor(
        usuario_id,
        usuario_email,
        materia = ""
    ) {
        super(usuario_id);
        super(usuario_email);
        this.usuario_id    = usuario_id;
        this.usuario_email = usuario_email;
        this.materia       = materia;
    }

    static async listar() {
        const [rows] = await connection.query("SELECT * FROM professores");
        return rows;
    }

    static async cadastrar(usuario_id, materia = null, connection = pool) {
        const [result] = await connection.query(
            "INSERT INTO professores (usuario_id, materia) VALUES (?, ?)",
            [usuario_id, materia]
        );
        return { id: result.insertId, usuario_id, materia };
    }

    static async editar(usuario_id, materia) {
        await connection.query(
            "UPDATE professores SET materia = ? WHERE usuario_id = ?",
            [materia, usuario_id]
        );
        return true;
    }

    static async deletar(usuario_id) {
        await connection.query("DELETE FROM professores WHERE usuario_id = ?", [usuario_id]);
        return true;
    }

    static async corrigirRedacao( redacao ) {
        redacao.corrigidaPorProfessor = true;
        redacao.feedback = "Correção realizada!";
        return redacao;
    }

    static async publicarMaterial( tema, subtema, titulo, materia, arquivo, criado_por) {
        const result = await connection.query(
            "INSERT INTO material ( tema, subtema, materia, titulo, arquivo, criado_por) VALUES (?, ?, ?, ?, ?, ?)",
            [ tema, subtema, materia, titulo, arquivo, criado_por]
        );
        return result;
    }
}

module.exports = Professor;