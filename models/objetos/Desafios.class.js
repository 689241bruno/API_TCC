const pool = require("../../config/db");

class Desafios {
  constructor(id, titulo, descricao, xp, img) {
    this.id = id;
    this.titulo = titulo;
    this.descricao = descricao;
    this.xp = xp;
    this.img = img;
  }

  // 1. LISTAR: Corrigido para acesso a result.rows
  static async listar() {
    try {
      const result = await pool.query("SELECT * FROM desafios");
      return result.rows; // 💡 PG: Acessa os resultados em .rows
    } catch (err) {
      console.error("Erro ao listar desafios:", err);
      throw new Error("Erro interno ao listar desafios.");
    }
  }

  // 2. CRIAR DESAFIO: Corrigido para $N, RETURNING id
  static async criar({ titulo, descricao, xp, img }) {
    try {
      // 💡 PG: Usa $N e RETURNING id
      const sql = `
                INSERT INTO desafios (titulo, descricao, xp, img) 
                VALUES ($1, $2, $3, $4)
                RETURNING id
            `;
      const values = [titulo, descricao, xp, img];

      const result = await pool.query(sql, values);

      return result.rows[0].id; // 💡 PG: Obtém o ID da linha retornada
    } catch (err) {
      console.error("Erro ao criar desafio:", err.message);
      throw new Error("Erro ao criar desafio.");
    }
  }

  // 3. EDITAR DESAFIO: Corrigido para $N
  static async editar(id, dados) {
    try {
      const { titulo, descricao, xp, img } = dados;

      // 💡 PG: Usa $N (do $1 ao $5)
      const sql =
        "UPDATE desafios SET titulo = $1, descricao = $2, xp = $3, img = $4 WHERE id = $5";
      const values = [titulo, descricao, xp, img, id];

      await pool.query(sql, values);
      return true;
    } catch (err) {
      console.error("Erro ao editar desafio:", err);
      throw new Error("Erro interno ao editar desafio.");
    }
  }

  // 4. DELETAR DESAFIO: Corrigido para $N
  static async deletar(id) {
    try {
      // 💡 PG: Usa $1
      await pool.query("DELETE FROM desafios WHERE id = $1", [id]);
      return true;
    } catch (err) {
      console.error("Erro ao deletar desafio:", err);
      throw new Error("Erro interno ao deletar desafio.");
    }
  }

  // 5. REGISTRAR PROGRESSO: Corrigido para $N, acesso a .rows e funções PG
  static async registrarProgresso(
    usuario_id,
    desafio_id,
    progresso,
    concluida
  ) {
    try {
      // Busca se o registro já existe (Acesso a .rows)
      const existsResult = await pool.query(
        "SELECT * FROM progresso_desafios WHERE usuario_id = $1 AND desafio_id = $2",
        [usuario_id, desafio_id]
      );
      const exists = existsResult.rows;

      if (exists.length > 0) {
        // UPDATE
        // 💡 PG: Usa CURRENT_TIMESTAMP ou NOW() e booleanos diretos (concluida)
        await pool.query(
          "UPDATE progresso_desafios SET progresso = $1, concluida = $2, concluida_em = NOW() WHERE usuario_id = $3 AND desafio_id = $4",
          [progresso, concluida, usuario_id, desafio_id]
        );
      } else {
        // INSERT
        await pool.query(
          "INSERT INTO progresso_desafios (usuario_id, desafio_id, progresso, concluida) VALUES ($1, $2, $3, $4)",
          [usuario_id, desafio_id, progresso, concluida]
        );
      }

      return true;
    } catch (err) {
      console.error("Erro ao registrar progresso:", err);
      throw new Error("Erro interno ao registrar progresso.");
    }
  }

  // 6. LISTAR PROGRESSO: Corrigido para $N e acesso a .rows
  static async listarProgresso(usuario_id) {
    try {
      const result = await pool.query(
        `SELECT d.*, pd.progresso, pd.concluida, pd.concluida_em
                FROM desafios d
                LEFT JOIN progresso_desafios pd ON d.id = pd.desafio_id AND pd.usuario_id = $1`,
        [usuario_id]
      );
      return result.rows;
    } catch (err) {
      console.error("Erro ao listar progresso:", err);
      throw new Error("Erro interno ao listar progresso.");
    }
  }

  // 7. MARCAR CONCLUIDA: Corrigido para $N e funções PG
  static async marcarConcluida(usuario_id, desafio_id) {
    try {
      // 💡 PG: Usa TRUE e NOW()
      const result = await pool.query(
        "UPDATE progresso_desafios SET concluida = TRUE, concluida_em = NOW() WHERE usuario_id = $1 AND desafio_id = $2",
        [usuario_id, desafio_id]
      );
      return result.rows;
    } catch (err) {
      console.error("Erro ao marcar concluída:", err);
      throw new Error("Erro interno ao marcar concluída.");
    }
  }
}

module.exports = Desafios;
