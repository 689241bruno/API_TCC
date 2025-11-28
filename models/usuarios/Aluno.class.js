const Usuario = require("./Usuario.class");
const pool = require("../../config/db");

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
    super(usuario_id);
    this.usuario_id = usuario_id;
    this.modoIntensivo = modoIntensivo;
    this.diagnostico = diagnostico;
    this.planoEstudosId = planoEstudosId;
    this.ranking = ranking;
    this.xp = xp;
    this.progresso_percent = progresso_percent;
  }

  static async listar() {
    try {
      const result = await pool.query("SELECT * FROM alunos");
      return result.rows;
    } catch (err) {
      console.error("Erro ao listar alunos:", err);
      throw new Error("Erro interno ao listar alunos.");
    }
  }

  static async cadastrar(
    usuario_id,
    modoIntensivo = false,
    diagnostico = "",
    planoEstudosId = null,
    client
  ) {
    const executor = client || pool;
    try {
      const sql = `
                INSERT INTO alunos 
                (usuario_id, modoIntensivo, diagnostico, plano_estudo_id, ranking, xp, progresso_percent) 
                VALUES ($1, $2, $3, $4, 0, 0, 0)
            `;

      const values = [usuario_id, modoIntensivo, diagnostico, planoEstudosId];

      await executor.query(sql, values);

      return usuario_id;
    } catch (err) {
      console.error("Erro ao cadastrar aluno:", err.message);
      throw new Error("Erro ao cadastrar aluno: " + err.message);
    }
  }

  static async editar(usuario_id, dados) {
    try {
      const {
        modoIntensivo,
        diagnostico,
        planoEstudosId,
        ranking,
        xp,
        progresso_percent,
      } = dados;

      const sql = `
                UPDATE alunos 
                SET modoIntensivo = $1, diagnostico = $2, plano_estudo_id = $3, ranking = $4, xp = $5, progresso_percent = $6 
                WHERE usuario_id = $7
            `;
      const values = [
        modoIntensivo,
        diagnostico,
        planoEstudosId,
        ranking,
        xp,
        progresso_percent,
        usuario_id,
      ];

      await pool.query(sql, values);
      return true;
    } catch (err) {
      console.error("Erro ao editar aluno:", err);
      throw new Error("Erro interno ao editar aluno.");
    }
  }

  static async deletar(usuario_id) {
    try {
      await pool.query("DELETE FROM alunos WHERE usuario_id = $1", [
        usuario_id,
      ]);
      return true;
    } catch (err) {
      console.error("Erro ao deletar aluno:", err);
      throw new Error("Erro interno ao deletar aluno.");
    }
  }

  static async buscarPorId(usuario_id) {
    try {
      const result = await pool.query(
        "SELECT * FROM alunos WHERE usuario_id = $1",
        [usuario_id]
      );
      return result.rows[0] || null;
    } catch (err) {
      console.error("Erro ao buscar aluno por ID:", err);
      throw new Error("Erro interno ao buscar aluno.");
    }
  }

  static async ativarModoIntensivo(usuario_id, modoIntensivo = true) {
    try {
      await pool.query(
        "UPDATE alunos SET modoIntensivo = $1 WHERE usuario_id = $2",
        [modoIntensivo, usuario_id]
      );
      return true;
    } catch (err) {
      console.error("Erro ao ativar/desativar modo intensivo:", err);
      throw new Error("Erro interno ao atualizar modo intensivo.");
    }
  }

  static async checkRanking(usuario_id) {
    try {
      const result = await pool.query(
        "SELECT ranking, xp FROM alunos WHERE usuario_id = $1",
        [usuario_id]
      );
      return result.rows[0] || null;
    } catch (err) {
      console.error("Erro ao checar ranking:", err);
      throw new Error("Erro interno ao checar ranking.");
    }
  }

  static async addXp(usuario_id, xp) {
    try {
      await pool.query("UPDATE alunos SET xp = xp + $1 WHERE usuario_id = $2", [
        xp,
        usuario_id,
      ]);

      const result = await pool.query(
        "SELECT xp FROM alunos WHERE usuario_id = $1",
        [usuario_id]
      );

      return result.rows[0];
    } catch (err) {
      console.error("Erro ao adicionar XP:", err);
      throw new Error("Erro interno ao adicionar XP.");
    }
  }

  static async listarRankingGeral() {
    const query = `
        SELECT
            a.usuario_id AS id, 
            u.nome, 
            a.xp,
            u.fotos , 
            a.tempo_estudo AS "studyTime" 
        FROM
            alunos a
        JOIN
            usuarios u ON a.usuario_id = u.id 
        ORDER BY
            a.xp DESC,   -- ORDENA APENAS PELO XP (DO MAIOR PARA O MENOR)
            u.nome ASC;  -- Critério de desempate
    `;

    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar ranking no DB:", error);

      throw new Error("Erro no banco de dados ao buscar o ranking.");
    }
  }
}

module.exports = Aluno;
