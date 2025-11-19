const Usuario = require("./Usuario.class");
const connection = require("../../config/db");

class Aluno extends Usuario {
    constructor(
        usuario_id,
        modoIntensivo = false,
        diagnostico = "",
        planoEstudosId = null,
        ranking = 0,
        xp = 0,
        progresso_percent = 0
    ) {
        super(usuario_id); // herda da classe Usuario
        this.usuario_id = usuario_id;
        this.modoIntensivo = modoIntensivo;
        this.diagnostico = diagnostico;
        this.planoEstudosId = planoEstudosId;
        this.ranking = ranking;
        this.xp = xp;
        this.progresso_percent = progresso_percent;
    }

    // Listar todos os alunos
    static async listar() {
        const [rows] = await connection.query("SELECT * FROM alunos");
        return rows;
    }

    // Cadastrar novo aluno
    static async cadastrar(usuario_id, modoIntensivo = false, diagnostico = "", planoEstudosId = null, connection) {
        try {
            await connection.query(
                `INSERT INTO alunos 
                (usuario_id, modoIntensivo, diagnostico, plano_estudo_id, ranking, xp, progresso_percent) 
                VALUES (?, ?, ?, ?, 0, 0, 0)`,
                [usuario_id, modoIntensivo, diagnostico, planoEstudosId]
            );
            return usuario_id;
        } catch (err) {
            console.error("Erro ao cadastrar aluno:", err.sqlMessage || err.message);
            throw new Error("Erro ao cadastrar aluno: " + (err.sqlMessage || err.message));
        }
    }

    // Editar informações do aluno
    static async editar(usuario_id, dados) {
        const { modoIntensivo, diagnostico, planoEstudosId, ranking, xp, progresso_percent } = dados;
        await connection.query(
            `UPDATE alunos 
            SET modoIntensivo = ?, diagnostico = ?, plano_estudo_id = ?, ranking = ?, xp = ?, progresso_percent = ? 
            WHERE usuario_id = ?`,
            [modoIntensivo, diagnostico, planoEstudosId, ranking, xp, progresso_percent, usuario_id]
        );
        return true;
    }

    // Deletar aluno
    static async deletar(usuario_id) {
        await connection.query("DELETE FROM alunos WHERE usuario_id = ?", [usuario_id]);
        return true;
    }

    // Buscar aluno por ID
    static async buscarPorId(usuario_id) {
        const [rows] = await connection.query("SELECT * FROM alunos WHERE usuario_id = ?", [usuario_id]);
        return rows[0] || null;
    }

    // Ativar ou desativar modo intensivo
    static async ativarModoIntensivo(usuario_id, modoIntensivo = true) {
        await connection.query("UPDATE alunos SET modoIntensivo = ? WHERE usuario_id = ?", [modoIntensivo, usuario_id]);
        return true;
    }

    // Consultar ranking e XP
    static async checkRanking(usuario_id) {
        const [rows] = await connection.query("SELECT ranking, xp FROM alunos WHERE usuario_id = ?", [usuario_id]);
        return rows[0] || null;
    }

    static async addXp(usuario_id, xp) {
        try {
            // Atualiza o XP
            await connection.query(
                "UPDATE alunos SET xp = xp + ? WHERE usuario_id = ?",
                [xp, usuario_id]
            );

            // Retorna o XP atualizado
            const [rows] = await connection.query(
                "SELECT xp FROM alunos WHERE usuario_id = ?",
                [usuario_id]
            );

            return rows[0]; // { xp: valorAtualizado }
        } catch (err) {
            console.error("Erro ao adicionar XP:", err);
            throw new Error("Erro interno ao adicionar XP.");
        }
    }   
}

module.exports = Aluno;
