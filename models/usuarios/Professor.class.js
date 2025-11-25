const Usuario = require("./Usuario.class");
const pool = require("../../config/db"); // Usando 'pool' para consistência

class Professor extends Usuario {
  constructor(usuario_id, usuario_email, materia = "") {
    // 💡 CORREÇÃO: Chama o construtor da classe pai (Usuario) apenas uma vez
    super(usuario_id);

    this.usuario_id = usuario_id;
    this.usuario_email = usuario_email;
    this.materia = materia;
  }

  // 1. LISTAR: Corrigido para acesso a result.rows
  static async listar() {
    try {
      const result = await pool.query("SELECT * FROM professores");
      return result.rows; // 💡 PG: Acessa os resultados em .rows
    } catch (err) {
      console.error("Erro ao listar professores:", err);
      throw new Error("Erro interno ao listar professores.");
    }
  }

  // 2. CADASTRAR: Corrigido para $N, RETURNING id e acesso a result.rows[0].id
  static async cadastrar(usuario_id, materia = null, client = pool) {
    const executor = client || pool;
    try {
      // 💡 PG: Usa $1, $2 e RETURNING id
      const sql = `
                INSERT INTO professores (usuario_id, materia) 
                VALUES ($1, $2)
                RETURNING id
            `;
      const values = [usuario_id, materia];

      const result = await executor.query(sql, values);

      // 💡 PG: Obtém o ID da linha retornada (result.rows[0].id)
      const id = result.rows[0].id;

      return { id: id, usuario_id, materia };
    } catch (err) {
      console.error("Erro ao cadastrar professor:", err.message);
      throw new Error("Erro ao cadastrar professor: " + err.message);
    }
  }

  // 3. EDITAR: Corrigido para $N
  static async editar(usuario_id, materia) {
    try {
      // 💡 PG: Usa $1, $2
      const sql = "UPDATE professores SET materia = $1 WHERE usuario_id = $2";
      await pool.query(sql, [materia, usuario_id]);
      return true;
    } catch (err) {
      console.error("Erro ao editar professor:", err);
      throw new Error("Erro interno ao editar professor.");
    }
  }

  // 4. DELETAR: Corrigido para $N
  static async deletar(usuario_id) {
    try {
      // 💡 PG: Usa $1
      await pool.query("DELETE FROM professores WHERE usuario_id = $1", [
        usuario_id,
      ]);
      return true;
    } catch (err) {
      console.error("Erro ao deletar professor:", err);
      throw new Error("Erro interno ao deletar professor.");
    }
  }

  // 5. PUBLICAR MATERIAL: Corrigido para $N, RETURNING id e acesso a result.rows[0].id
  static async publicarMaterial(
    tema,
    subtema,
    titulo,
    materia,
    arquivo,
    criado_por
  ) {
    try {
      // 💡 PG: Usa $1 a $6 e RETURNING id
      const sql = `
                INSERT INTO material (tema, subtema, materia, titulo, arquivo, criado_por) 
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            `;
      const values = [tema, subtema, materia, titulo, arquivo, criado_por];

      const result = await pool.query(sql, values);

      // Retorna o ID do material criado
      return result.rows[0];
    } catch (err) {
      console.error("Erro ao publicar material:", err);
      throw new Error("Erro interno ao publicar material: " + err.message);
    }
  }

  // Método não-SQL mantido
  static async corrigirRedacao(redacao) {
    redacao.corrigidaPorProfessor = true;
    redacao.feedback = "Correção realizada!";
    return redacao;
  }
}

module.exports = Professor;
