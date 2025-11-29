const pool = require("../../config/db");

class Usuario {
  constructor(
    id,
    nome,
    email,
    senha,
    is_aluno = false,
    is_professor = false,
    is_admin = false,
    foto,
    cor,
    criado_em
  ) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.is_aluno = is_aluno;
    this.is_professor = is_professor;
    this.is_admin = is_admin;
    this.foto = foto;
    this.cor = cor;
    this.criado_em = criado_em;
  }

  static async listar() {
    try {
      const result = await pool.query("SELECT * FROM usuarios");
      return result.rows;
    } catch (err) {
      console.error("Erro SQL no listar:", err);
      throw err;
    }
  }

  static async cadastrar(
    nome,
    email,
    senha,
    is_aluno,
    is_professor,
    is_admin,
    client
  ) {
    const executor = client || pool;

    try {
      const sql = `
                INSERT INTO usuarios (nome, email, senha, is_aluno, is_professor, is_admin)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id, nome, email, is_aluno, is_professor, is_admin
            `;

      const values = [nome, email, senha, is_aluno, is_professor, is_admin];

      const result = await executor.query(sql, values);

      return result.rows[0];
    } catch (err) {
      console.error("Erro SQL no cadastrar usuário:", err.message);
      throw new Error("Erro ao cadastrar usuário: " + err.message);
    }
  }

  static async login(email, senha) {
    try {
      const result = await pool.query(
        "SELECT * FROM usuarios WHERE email = $1 AND senha = $2",
        [email, senha]
      );

      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
      console.error("Erro na consulta de login:", err);
      throw err;
    }
  }

  static async editar(id, dados) {
    console.log("Entrou em Usuario.editar com:", id, dados);

    if (!dados || typeof dados !== "object") {
      throw new Error("Parâmetro 'dados' está indefinido ou inválido.");
    }

    try {
      let campos = [];
      let valores = [];
      let contador = 1;

      for (const key in dados) {
        if (dados[key] !== undefined && key !== "id") {
          campos.push(`${key} = $${contador++}`);
          valores.push(dados[key]);
        }
      }

      if (campos.length === 0) return;

      const usuarioAtualResult = await pool.query(
        "SELECT * FROM usuarios WHERE id = $1",
        [id]
      );
      const usuarioAtual = usuarioAtualResult.rows;

      if (usuarioAtual.length === 0) throw new Error("Usuário não encontrado.");

      const emailAntigo = usuarioAtual[0].email;

      const ehAdminResult = await pool.query(
        "SELECT * FROM admin WHERE usuario_email = $1",
        [emailAntigo]
      );
      const ehAdmin = ehAdminResult.rows;

      if (ehAdmin.length > 0 && dados.email && dados.email !== emailAntigo) {
        throw new Error(
          "Não é permitido alterar o email de um administrador, pois é chave estrangeira."
        );
      }

      console.log("Dados recebidos para edição:", dados);

      const sql = `UPDATE usuarios SET ${campos.join(
        ", "
      )} WHERE id = $${contador}`;
      valores.push(id);

      await pool.query(sql, valores);
      console.log("Query final:", sql, valores);

      const usuarioAtualizadoResult = await pool.query(
        "SELECT * FROM usuarios WHERE id = $1",
        [id]
      );
      const user = usuarioAtualizadoResult.rows[0];

      if (user.foto) {
        const base64 = Buffer.from(user.foto).toString("base64");
        user.foto = `data:image/jpeg;base64,${base64}`;
      }

      return user;
    } catch (err) {
      console.error("Erro ao editar usuário:", err);
      throw err;
    }
  }

  static async deletar(id) {
    await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
    return true;
  }

  static async checkUserType(email) {
    const result = await pool.query(
      "SELECT id, nome, is_aluno, is_professor, is_admin FROM usuarios WHERE email = $1",
      [email]
    );
    return result.rows[0] || null;
  }

  static async checkUser(email) {
    const result = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [email]
    );
    return result.rows.length > 0;
  }

  static async checkUserPass(email, senha) {
    const result = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1 AND senha = $2",
      [email, senha]
    );
    return result.rows.length > 0;
  }

  static async buscarPorId(id) {
    try {
      const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [
        id,
      ]);
      const rows = result.rows;

      if (rows.length === 0) {
        return null;
      }

      const usuario = rows[0];

      if (usuario.foto) {
        const base64 = Buffer.from(usuario.foto).toString("base64");
        usuario.foto = `data:image/jpeg;base64,${base64}`;
      }

      return usuario;
    } catch (err) {
      console.error("Erro ao buscar usuário por ID:", err);
      throw new Error("Erro interno ao buscar usuário.");
    }
  }

  static async buscarTodosUsuarios() {
    try {
      const result = await pool.query("SELECT id, nome FROM usuarios");
      return result.rows;
    } catch (error) {
      console.error("Erro ao buscar usuários para migração:", error);
      throw new Error("Falha na busca de usuários.");
    }
  }
}

module.exports = Usuario;
