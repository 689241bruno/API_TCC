const Usuario = require("./Usuario.class"); // 💡 CORREÇÃO: Importa a classe pai
const pool = require("../../config/db"); // Usando 'pool' para consistência

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
    try {
      // 💡 PG: Usa pool.query e acessa .rows
      const result = await pool.query("SELECT * FROM alunos");
      return result.rows;
    } catch (err) {
      console.error("Erro ao listar alunos:", err);
      throw new Error("Erro interno ao listar alunos.");
    }
  }

  // Cadastrar novo aluno (usa o 'client' da transação)
  static async cadastrar(
    usuario_id,
    modoIntensivo = false,
    diagnostico = "",
    planoEstudosId = null,
    client
  ) {
    // Usa o 'client' de transação passado pelo controller
    const executor = client || pool;
    try {
      // 💡 PG: Mapeamento de placeholders: $1, $2, $3, $4
      const sql = `
                INSERT INTO alunos 
                (usuario_id, modoIntensivo, diagnostico, plano_estudo_id, ranking, xp, progresso_percent) 
                VALUES ($1, $2, $3, $4, 0, 0, 0)
            `;
      // Nota: O tipo BOOLEAN no PostgreSQL aceita true/false ou 1/0
      const values = [usuario_id, modoIntensivo, diagnostico, planoEstudosId];

      await executor.query(sql, values);

      return usuario_id;
    } catch (err) {
      // No PG, a mensagem de erro está em err.message
      console.error("Erro ao cadastrar aluno:", err.message);
      throw new Error("Erro ao cadastrar aluno: " + err.message);
    }
  }

  // Editar informações do aluno
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
      // 💡 PG: Mapeamento de placeholders: $1 a $7
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

  // Deletar aluno
  static async deletar(usuario_id) {
    try {
      // 💡 PG: Mapeamento de placeholders: $1
      await pool.query("DELETE FROM alunos WHERE usuario_id = $1", [
        usuario_id,
      ]);
      return true;
    } catch (err) {
      console.error("Erro ao deletar aluno:", err);
      throw new Error("Erro interno ao deletar aluno.");
    }
  }

  // Buscar aluno por ID
  static async buscarPorId(usuario_id) {
    try {
      // 💡 PG: Mapeamento de placeholders: $1, e acesso a .rows
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

  // Ativar ou desativar modo intensivo
  static async ativarModoIntensivo(usuario_id, modoIntensivo = true) {
    try {
      // 💡 PG: Mapeamento de placeholders: $1, $2
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

  // Consultar ranking e XP
  static async checkRanking(usuario_id) {
    try {
      // 💡 PG: Mapeamento de placeholders: $1, e acesso a .rows
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
      // 💡 PG: Para operações com o mesmo campo (xp = xp + $1), o placeholder é $1
      // e a coluna é referenciada diretamente no SQL.

      // Atualiza o XP
      await pool.query("UPDATE alunos SET xp = xp + $1 WHERE usuario_id = $2", [
        xp,
        usuario_id,
      ]);

      // Retorna o XP atualizado
      const result = await pool.query(
        "SELECT xp FROM alunos WHERE usuario_id = $1",
        [usuario_id]
      );

      return result.rows[0]; // { xp: valorAtualizado }
    } catch (err) {
      console.error("Erro ao adicionar XP:", err);
      throw new Error("Erro interno ao adicionar XP.");
    }
  }
}

module.exports = Aluno;
