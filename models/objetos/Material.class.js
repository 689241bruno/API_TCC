const pool = require("../../config/db");

class Material {
  constructor(id, materia, tema, titulo, arquivo, criado_por, concluida) {
    this.id = id;
    this.titulo = titulo;
    this.tema = tema;
    this.materia = materia;
    this.arquivo = arquivo;
    this.criado_por = criado_por;
    this.concluida = concluida;
  }

  static fromDB(row) {
    // Construtor ligeiramente ajustado para corresponder à ordem dos campos
    return new Material(
      row.id,
      row.materia, // Ajuste a ordem aqui, se necessário, ou no construtor
      row.tema,
      row.titulo,
      row.arquivo,
      row.criado_por,
      row.concluida || 0
    );
  }

  // 1. LISTAR: Corrigido para acesso a result.rows
  static async listar() {
    try {
      console.log("[Material.listar] Executando SELECT * FROM material");

      // 💡 PG: pool.query() retorna o objeto de resultado
      const result = await pool.query("SELECT * FROM material");
      const rows = result.rows;

      console.log(`[Material.listar] ${rows.length} registros encontrados`);
      // console.table(rows); // Removido console.table pois pode falhar com grande volume

      return rows;
    } catch (err) {
      console.error("[Material.listar] Erro SQL:", err);
      throw err;
    }
  }

  // 2. LISTAR MATERIAL: Corrigido para $N e acesso a .rows
  static async listarMaterial(materia) {
    try {
      console.log("Listando materiais para: ", materia);

      // 💡 PG: Usa $1 e acessa .rows
      const result = await pool.query(
        "SELECT * FROM material WHERE materia = $1",
        [materia]
      );
      const rows = result.rows;

      const materiais = rows.map((row) => ({
        id: row.id,
        tema: row.tema,
        subtema: row.subtema,
        materia: row.materia,
        titulo: row.titulo,
        // 💡 Tratamento de Buffer (BYTEA) do PG para Base64:
        arquivo: row.arquivo
          ? Buffer.from(row.arquivo).toString("base64")
          : null,
        criado_por: row.criado_por,
      }));

      return materiais;
    } catch (err) {
      console.error("Erro SQL no listarMaterial:", err);
      throw err;
    }
  }

  // 3. ATUALIZAR PROGRESSO: Corrigido para $N e lógica PG (booleanos TRUE/FALSE)
  static async atualizarProgresso(idUsuario, atividadeId, concluida) {
    try {
      // 💡 PG: Usa $1, $2 e acessa .rows
      const existingResult = await pool.query(
        "SELECT * FROM progresso_atividades WHERE usuario_id = $1 AND atividade_id = $2",
        [idUsuario, atividadeId]
      );
      const existing = existingResult.rows;

      if (existing.length > 0) {
        // UPDATE
        // 💡 PG: Usa TRUE ou FALSE para booleanos
        await pool.query(
          "UPDATE progresso_atividades SET concluida = $1 WHERE usuario_id = $2 AND atividade_id = $3",
          [concluida ? true : false, idUsuario, atividadeId]
        );
      } else {
        // INSERT
        await pool.query(
          "INSERT INTO progresso_atividades (usuario_id, atividade_id, concluida) VALUES ($1, $2, $3)",
          [idUsuario, atividadeId, concluida ? true : false]
        );
      }
    } catch (err) {
      console.error("Erro ao atualizar progresso:", err);
      throw new Error("Erro interno ao atualizar progresso: " + err.message);
    }
  }

  // 4. LISTAR PROGRESSO: Corrigido para $N e acesso a .rows
  static async listarProgresso(idUsuario) {
    try {
      // 💡 PG: Usa $1 e acessa .rows
      const result = await pool.query(
        `SELECT p.atividade_id, p.concluida, m.materia
                FROM progresso_atividades p
                LEFT JOIN material m ON p.atividade_id = m.id
                WHERE p.usuario_id = $1`,
        [idUsuario]
      );
      return result.rows;
    } catch (err) {
      console.error("Erro ao listar progresso:", err);
      throw new Error("Erro interno ao listar progresso.");
    }
  }

  // 5. VER PDF: Corrigido para $N e acesso a .rows (retorna o resultado bruto do DB)
  static async verPDF(id) {
    try {
      // 💡 PG: Usa $1
      const result = await pool.query(
        "SELECT arquivo FROM material WHERE id = $1",
        [id]
      );
      return result.rows[0]?.arquivo || null; // Retorna o buffer do arquivo (ou null)
    } catch (err) {
      console.error("Erro ao visualizar PDF:", err);
      throw new Error("Erro interno ao visualizar PDF.");
    }
  }
}

module.exports = Material;
