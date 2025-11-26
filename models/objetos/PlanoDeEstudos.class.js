const pool = require("../../config/db");

class PlanoDeEstudos {
  constructor(id, usuario_id, dia, materia, tema, inicio, termino) {
    this.id = id;
    this.usuario_id = usuario_id;
    this.dia = dia;
    this.materia = materia;
    this.tema = tema;
    this.inicio = inicio;
    this.termino = termino;
  }

  static async listar(usuario_id) {
    try {
      const result = await pool.query(
        "SELECT * FROM plano_estudos WHERE usuario_id = $1",
        [usuario_id]
      );
      return result.rows;
    } catch (err) {
      console.error("Erro ao listar planos de estudo:", err);
      throw new Error("Erro interno ao listar planos de estudo.");
    }
  }

  static async criar({ usuario_id, dia, materia, tema, inicio, termino }) {
    try {
      const sql = `
                INSERT INTO plano_estudos (usuario_id, dia, materia, tema, inicio, termino)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            `;
      const values = [usuario_id, dia, materia, tema, inicio, termino];

      const result = await pool.query(sql, values);

      return result.rows[0].id;
    } catch (err) {
      console.error("Erro ao criar plano de estudos:", err);
      throw new Error("Erro ao criar plano de estudos: " + err.message);
    }
  }

  static async editar(id, dados) {
    try {
      const { dia, materia, tema, inicio, termino } = dados;

      const sql = `
                UPDATE plano_estudos 
                SET dia = $1, materia = $2, tema = $3, inicio = $4, termino = $5
                WHERE id = $6
            `;
      const values = [dia, materia, tema, inicio, termino, id];

      await pool.query(sql, values);
      return true;
    } catch (err) {
      console.error("Erro ao editar plano de estudos:", err);
      throw new Error("Erro interno ao editar plano de estudos.");
    }
  }

  static async deletar(id) {
    try {
      await pool.query("DELETE FROM plano_estudos WHERE id = $1", [id]);
      return true;
    } catch (err) {
      console.error("Erro ao deletar plano de estudos:", err);
      throw new Error("Erro interno ao deletar plano de estudos.");
    }
  }
}

module.exports = PlanoDeEstudos;
