const Usuario = require("./Usuario.class");
const pool = require("../../config/db");

class Professor extends Usuario {
  constructor(usuario_id, usuario_email, materia = "") {
    super(usuario_id);

    this.usuario_id = usuario_id;
    this.usuario_email = usuario_email;
    this.materia = materia;
  }

  static async listar() {
    try {
      const result = await pool.query("SELECT * FROM professores");
      return result.rows;
    } catch (err) {
      console.error("Erro ao listar professores:", err);
      throw new Error("Erro interno ao listar professores.");
    }
  }

  static async cadastrar(usuario_id, materia = null, client = pool) {
    const executor = client || pool;
    try {
      const sql = `
                INSERT INTO professores (usuario_id, materia) 
                VALUES ($1, $2)
                RETURNING id
            `;
      const values = [usuario_id, materia];

      const result = await executor.query(sql, values);

      const id = result.rows[0].id;

      return { id: id, usuario_id, materia };
    } catch (err) {
      console.error("Erro ao cadastrar professor:", err.message);
      throw new Error("Erro ao cadastrar professor: " + err.message);
    }
  }

  static async editar(usuario_id, materia) {
    try {
      const sql = "UPDATE professores SET materia = $1 WHERE usuario_id = $2";
      await pool.query(sql, [materia, usuario_id]);
      return true;
    } catch (err) {
      console.error("Erro ao editar professor:", err);
      throw new Error("Erro interno ao editar professor.");
    }
  }

  static async deletar(usuario_id) {
    try {
      await pool.query("DELETE FROM professores WHERE usuario_id = $1", [
        usuario_id,
      ]);
      return true;
    } catch (err) {
      console.error("Erro ao deletar professor:", err);
      throw new Error("Erro interno ao deletar professor.");
    }
  }

  static async publicarMaterial(
    tema,
    subtema,
    titulo,
    materia,
    arquivo,
    criado_por
  ) {
    try {
      const sql = `
                INSERT INTO material (tema, subtema, materia, titulo, arquivo, criado_por) 
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            `;
      const values = [tema, subtema, materia, titulo, arquivo, criado_por];

      const result = await pool.query(sql, values);

      return result.rows[0];
    } catch (err) {
      console.error("Erro ao publicar material:", err);
      throw new Error("Erro interno ao publicar material: " + err.message);
    }
  }

  static async corrigirRedacao(redacao) {
    redacao.corrigidaPorProfessor = true;
    redacao.feedback = "Correção realizada!";
    return redacao;
  }
}

module.exports = Professor;
