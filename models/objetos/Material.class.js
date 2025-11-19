const pool = require("../../config/db");

class Material {
    constructor(id, materia, tema, titulo, arquivo, criado_por, concluida) {
        this.id = id;
        this.titulo = titulo;
        this.tema = tema;
        this.materia = materia;
        this.arquivo = arquivo;
        this.criado_por = criado_por;
        this.concluida = concluida;
    }

    static fromDB(row) {
        return new Material(
            row.id,
            row.titulo,
            row.tema,
            row.materia,
            row.arquivo,
            row.criado_por,
            row.concluida || 0
        );
    }

    // Para Admins
    static async listar() {
        try {
            console.log("[Material.listar] Executando SELECT * FROM material");
            const [rows] = await pool.query("SELECT * FROM material");
            console.log(`[Material.listar] ${rows.length} registros encontrados`);
            console.table(rows); // Mostra todos os registros encontrados
            return rows;
        } catch (err) {
            console.error("[Material.listar] Erro SQL:", err);
            throw err;
        }
    }

    static async listarMaterial(materia) {
        try {
            console.log("Listando materiais para: ", materia);
            const [rows] = await pool.query(
                "SELECT * FROM material WHERE materia = ?",
                [materia]
            );

            const materiais = rows.map(row => ({
                id: row.id,
                tema: row.tema,
                subtema: row.subtema,
                materia: row.materia,
                titulo: row.titulo,
                arquivo: row.arquivo ? row.arquivo.toString("base64") : null,
                criado_por: row.criado_por
            }));

            return materiais;
        } catch (err) {
            console.error("Erro SQL no listarMaterial:", err);
            throw err;
        }    
    }

    static async atualizarProgresso(idUsuario, atividadeId, concluida) {
        const [existing] = await pool.query(
            "SELECT * FROM progresso_atividades WHERE usuario_id=? AND atividade_id=?",
            [idUsuario, atividadeId]
        );
    
        if (existing.length > 0) {
            await pool.query(
                "UPDATE progresso_atividades SET concluida = 1 WHERE usuario_id=? AND atividade_id=?",
                [idUsuario, atividadeId]
            );
        } else {
            await pool.query(
                "INSERT INTO progresso_atividades (usuario_id, atividade_id, concluida) VALUES (?, ?, 1)",
                [idUsuario, atividadeId]
            );
        }
    }

    static async listarProgresso(idUsuario){
        const [rows] = await pool.query(
            `SELECT p.atividade_id, p.concluida, m.materia
            FROM progresso_atividades p
            LEFT JOIN material m ON p.atividade_id = m.id
            WHERE p.usuario_id=?`,
            [idUsuario]
        );
        return rows;
    }

    static async verPDF(id) {
        const res = await pool.query("SELECT arquivo FROM material WHERE id = ?", [id]);
        return res;
    }
}

module.exports = Material;