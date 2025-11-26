const Usuario = require("./Usuario.class");
const pool = require("../../config/db");

class Admin extends Usuario {
  constructor(usuario_id, usuario_email) {
    super(usuario_id);

    this.usuario_id = usuario_id;
    this.usuario_email = usuario_email;
  }

  static async cadastrar(usuario_id, usuario_email, client = pool) {
    const executor = client || pool;
    try {
      const sql = `
                INSERT INTO admin (usuario_id, usuario_email) 
                VALUES ($1, $2)
                RETURNING id
            `;
      const values = [usuario_id, usuario_email];

      const result = await executor.query(sql, values);

      const id = result.rows[0].id;

      return { id: id, usuario_id, usuario_email };
    } catch (err) {
      console.error("Erro ao cadastrar admin:", err.message);
      throw new Error("Erro ao cadastrar admin: " + err.message);
    }
  }

  static async listar() {
    try {
      const result = await pool.query("SELECT * FROM admin");
      return result.rows;
    } catch (err) {
      console.error("Erro ao listar admins:", err);
      throw err;
    }
  }

  static async editarMaterial(idMaterial, dados) {
    const { titulo, materia, tema, subtema, arquivo } = dados;

    try {
      let campos = [];
      let values = [];
      let contador = 1;

      if (titulo) {
        campos.push(`titulo = $${contador++}`);
        values.push(titulo);
      }
      if (materia) {
        campos.push(`materia = $${contador++}`);
        values.push(materia);
      }
      if (tema) {
        campos.push(`tema = $${contador++}`);
        values.push(tema);
      }
      if (subtema) {
        campos.push(`subtema = $${contador++}`);
        values.push(subtema);
      }

      if (arquivo) {
        campos.push(`arquivo = $${contador++}`);
        values.push(arquivo);
      }

      if (campos.length === 0) return true;

      const query = `UPDATE material SET ${campos.join(
        ", "
      )} WHERE id = $${contador}`;
      values.push(idMaterial);

      await pool.query(query, values);
      return true;
    } catch (err) {
      console.error("Erro ao editar material:", err);
      throw new Error("Erro interno ao editar material: " + err.message);
    }
  }

  static async deletarMaterial(idMaterial) {
    try {
      const query = "DELETE FROM material WHERE id = $1";
      await pool.query(query, [idMaterial]);
      return true;
    } catch (err) {
      console.error("Erro ao deletar material:", err);
      throw new Error("Erro interno ao deletar material: " + err.message);
    }
  }
}

module.exports = Admin;
