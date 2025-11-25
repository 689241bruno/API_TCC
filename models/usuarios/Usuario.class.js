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

  // 1. LISTAR: Corrigido para acessar resultados via .rows
  static async listar() {
    try {
      const result = await pool.query("SELECT * FROM usuarios");
      return result.rows; // 💡 PG: Acessa os resultados em .rows
    } catch (err) {
      console.error("Erro SQL no listar:", err);
      throw err;
    }
  }

  // 2. CADASTRAR: Corrigido para $N, RETURNING id e acesso a result.rows[0].id
  static async cadastrar(
    nome,
    email,
    senha,
    is_aluno,
    is_professor,
    is_admin,
    client
  ) {
    // Usa o 'client' (para transações) ou o 'pool' (para consultas simples)
    const executor = client || pool;

    try {
      const sql = `
                INSERT INTO usuarios (nome, email, senha, is_aluno, is_professor, is_admin)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id, nome, email, is_aluno, is_professor, is_admin
            `;

      const values = [nome, email, senha, is_aluno, is_professor, is_admin];

      const result = await executor.query(sql, values);

      // 💡 PG: Obtém o ID e os dados da linha retornada (result.rows[0])
      return result.rows[0];
    } catch (err) {
      // No PG, a mensagem de erro está em err.message
      console.error("Erro SQL no cadastrar usuário:", err.message);
      throw new Error("Erro ao cadastrar usuário: " + err.message);
    }
  }

  // 3. LOGIN: Corrigido para $N e acesso a result.rows
  static async login(email, senha) {
    try {
      const result = await pool.query(
        "SELECT * FROM usuarios WHERE email = $1 AND senha = $2",
        [email, senha]
      );
      // 💡 PG: Verifica o tamanho de .rows
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
      console.error("Erro na consulta de login:", err);
      throw err;
    }
  }

  // 4. EDITAR: Corrigido para $N e mapeamento dinâmico
  static async editar(id, dados) {
    console.log("Entrou em Usuario.editar com:", id, dados);

    if (!dados || typeof dados !== "object") {
      throw new Error("Parâmetro 'dados' está indefinido ou inválido.");
    }

    try {
      let campos = [];
      let valores = [];
      let contador = 1; // Contador para placeholders $1, $2, etc.

      // Itera sobre os dados para criar a query UPDATE
      for (const key in dados) {
        if (dados[key] !== undefined && key !== "id") {
          campos.push(`${key} = $${contador++}`);
          valores.push(dados[key]);
        }
      }

      if (campos.length === 0) return;

      // Busca o usuário atual antes de atualizar
      const usuarioAtualResult = await pool.query(
        "SELECT * FROM usuarios WHERE id = $1",
        [id]
      );
      const usuarioAtual = usuarioAtualResult.rows; // 💡 PG: .rows

      if (usuarioAtual.length === 0) throw new Error("Usuário não encontrado.");

      const emailAntigo = usuarioAtual[0].email;

      // Verifica se é admin (Ajustando a query e o acesso a .rows)
      const ehAdminResult = await pool.query(
        "SELECT * FROM admin WHERE usuario_email = $1",
        [emailAntigo]
      );
      const ehAdmin = ehAdminResult.rows; // 💡 PG: .rows

      // Impede alterar email de admin
      if (ehAdmin.length > 0 && dados.email && dados.email !== emailAntigo) {
        throw new Error(
          "Não é permitido alterar o email de um administrador, pois é chave estrangeira."
        );
      }

      console.log("Dados recebidos para edição:", dados);

      // Adiciona o ID do WHERE ao final dos valores
      const sql = `UPDATE usuarios SET ${campos.join(
        ", "
      )} WHERE id = $${contador}`;
      valores.push(id);

      await pool.query(sql, valores);
      console.log("Query final:", sql, valores);

      // Seleciona o usuário atualizado (Ajustando a query e o acesso a .rows)
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

  // 5. DELETAR: Corrigido para $N
  static async deletar(id) {
    await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
    return true;
  }

  // 6. CHECKUSERTYPE: Corrigido para $N e acesso a .rows
  static async checkUserType(email) {
    // Removendo parâmetros não utilizados
    const result = await pool.query(
      "SELECT id, nome, is_aluno, is_professor, is_admin FROM usuarios WHERE email = $1",
      [email]
    );
    return result.rows[0] || null;
  }

  // 7. CHECKUSER: Corrigido para $N e acesso a .rows
  static async checkUser(email) {
    const result = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [email]
    );
    return result.rows.length > 0;
  }

  // 8. CHECKUSERPASS: Corrigido para $N e acesso a .rows
  static async checkUserPass(email, senha) {
    const result = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1 AND senha = $2",
      [email, senha]
    );
    return result.rows.length > 0;
  }

  // 9. BUSCARPORID: Corrigido para $N e acesso a .rows
  static async buscarPorId(id) {
    try {
      const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [
        id,
      ]);
      const rows = result.rows; // 💡 PG: .rows

      if (rows.length === 0) {
        return null; // retorna null se o usuário não existir
      }

      const usuario = rows[0];

      // ✅ Converte buffer para Base64
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
}

module.exports = Usuario;
