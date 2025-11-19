const pool = require('../../config/db');

class PlanoDeEstudos {
    constructor(id, usuario_id, dia, materia, tema, inicio, termino){
        this.id = id;
        this.usuario_id = usuario_id;
        this.dia = dia;
        this.materia = materia; 
        this.tema = tema; 
        this.inicio = inicio; 
        this.termino = termino;
    }

    static async listar(usuario_id) {
        const [rows] = await pool.query("SELECT * FROM plano_estudos WHERE usuario_id = ?",
            [usuario_id]
        );
        return rows;
    }

    static async criar({ usuario_id, dia, materia, tema, inicio, termino }) {
        const [result] = await pool.query(
            `INSERT INTO plano_estudos (usuario_id, dia, materia, tema, inicio, termino)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [usuario_id, dia, materia, tema, inicio, termino]
        );
        return result.insertId;
    }

    static async editar(id, dados) {
        const { dia, materia, tema, inicio, termino } = dados;
        await pool.query(
            `UPDATE plano_estudos 
            SET dia = ?, materia = ?, tema = ?, inicio = ?, termino = ?
            WHERE id = ?`,
            [dia, materia, tema, inicio, termino, id]
        );
        return true;
    }

    static async deletar(id) {
        await pool.query("DELETE FROM plano_estudos WHERE id = ?", [id]);
        return true;
    }
}

module.exports = PlanoDeEstudos;