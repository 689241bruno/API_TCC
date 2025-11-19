const pool = require("../../config/db");

class Desafios {
    constructor( id, titulo, descricao, xp, img) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.xp = xp;
        this.img = img;
    }

    // Listar todos os desafios
    static async listar() {
        const [rows] = await pool.query("SELECT * FROM desafios");
        return rows;
    }

    // Criar desafio
    static async criar({ titulo, descricao, xp, img }) {
        const [result] = await pool.query(
            "INSERT INTO desafios (titulo, descricao, xp, img) VALUES (?, ?, ?, ?)",
            [titulo, descricao, xp, img]
        );
        return result.insertId;
    }

    // Editar desafio
    static async editar(id, dados) {
        const { titulo, descricao, xp, img } = dados;
        await pool.query(
            "UPDATE desafios SET titulo = ?, descricao = ?, xp = ?, img = ? WHERE id = ?",
            [titulo, descricao, xp, img, id]
        );
        return true;
    }

    // Deletar desafio
    static async deletar(id) {
        await pool.query("DELETE FROM desafios WHERE id = ?", [id]);
        return true;
    }

    // Registrar progresso de usuário
    static async registrarProgresso(usuario_id, desafio_id, progresso, concluida) {
        const [exists] = await pool.query(
            "SELECT * FROM progresso_desafios WHERE usuario_id = ? AND desafio_id = ?",
            [usuario_id, desafio_id]
        );

        if (exists.length > 0) {
            await pool.query(
                "UPDATE progresso_desafios SET progresso = ?, concluida = ?, concluida_em = NOW() WHERE usuario_id = ? AND desafio_id = ?",
                [progresso, concluida ? 1 : 0, usuario_id, desafio_id]
            );
        } else {
            await pool.query(
                "INSERT INTO progresso_desafios (usuario_id, desafio_id, progresso, concluida) VALUES (?, ?, ?, ?)",
                [usuario_id, desafio_id, progresso, concluida ? 1 : 0]
            );
        }

        return true;
    }

    // Listar progresso do usuário
    static async listarProgresso(usuario_id) {
        const [rows] = await pool.query(
            `SELECT d.*, pd.progresso, pd.concluida, pd.concluida_em
            FROM desafios d
            LEFT JOIN progresso_desafios pd ON d.id = pd.desafio_id AND pd.usuario_id = ?`,
            [usuario_id]
        );
        return rows;
    }

    static async marcarConcluida(usuario_id, desafio_id) {
        const [rows] = await pool.query(
            "UPDATE progresso_desafios SET concluida = 1, concluida_em = NOW() WHERE usuario_id = ? AND desafio_id = ?",
            [usuario_id, desafio_id]
        );
        return rows;
    }
}

module.exports = Desafios;