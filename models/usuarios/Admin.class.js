const Usuario = require("./Usuario.class");
const pool = require("../../config/db");

class Admin extends Usuario {
  constructor(usuario_id, usuario_email) {
    // 💡 CORREÇÃO: Chama o construtor da classe pai (Usuario) apenas uma vez
    super(usuario_id);
    // super(usuario_email) não é necessário aqui, pois o construtor pai
    // provavelmente não espera 'usuario_email' como segundo argumento.

    this.usuario_id = usuario_id;
    this.usuario_email = usuario_email;
  }

  // 1. CADASTRAR: Corrigido para $N, RETURNING id e acesso a result.rows[0].id
  static async cadastrar(usuario_id, usuario_email, client = pool) {
    const executor = client || pool;
    try {
      // 💡 PG: Usa $1, $2 e RETURNING id
      const sql = `
                INSERT INTO admin (usuario_id, usuario_email) 
                VALUES ($1, $2)
                RETURNING id
            `;
      const values = [usuario_id, usuario_email];

      const result = await executor.query(sql, values);

      // 💡 PG: Obtém o ID da linha retornada (result.rows[0].id)
      const id = result.rows[0].id;

      return { id: id, usuario_id, usuario_email };
    } catch (err) {
      // No PG, a mensagem de erro está em err.message
      console.error("Erro ao cadastrar admin:", err.message);
      throw new Error("Erro ao cadastrar admin: " + err.message);
    }
  }

  // 2. LISTAR: Corrigido para acesso a result.rows
  static async listar() {
    try {
      // Nota: Corrigido o nome da tabela de 'admins' para 'admin' (padrão singular)
      const result = await pool.query("SELECT * FROM admin");
      return result.rows; // 💡 PG: Acessa os resultados em .rows
    } catch (err) {
      console.error("Erro ao listar admins:", err);
      throw err;
    }
  }

  // 3. EDITAR MATERIAL: Corrigido para $N e mapeamento dinâmico
  static async editarMaterial(idMaterial, dados) {
    const { titulo, materia, tema, subtema, arquivo } = dados;

    try {
      let campos = [];
      let values = [];
      let contador = 1;

      // Define os campos obrigatórios
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

      // Adiciona o campo 'arquivo' se existir
      if (arquivo) {
        campos.push(`arquivo = $${contador++}`);
        values.push(arquivo);
      }

      if (campos.length === 0) return true; // Nada para atualizar

      // Adiciona o ID do WHERE ao final dos valores
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

  // 4. DELETAR MATERIAL: Corrigido para $N
  static async deletarMaterial(idMaterial) {
    try {
      // 💡 PG: Usa $1
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
