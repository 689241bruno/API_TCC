const pool = require("../../config/db");

class Questao {
  constructor(
    id,
    enunciado,
    alternativas = [],
    respostaCorreta,
    materia,
    dificuldade
  ) {
    this.id = id;
    this.enunciado = enunciado;
    this.alternativas = alternativas;
    this.respostaCorreta = respostaCorreta;
    this.materia = materia;
    this.dificuldade = dificuldade;
  }

  verificarResposta(resposta) {
    return resposta === this.respostaCorreta;
  }

  // --- MÉTODOS DE BANCO DE DADOS (PG) ---

  // 1. CADASTRAR: Exemplo de inserção de uma nova questão
  // Nota: 'alternativas' é um array e precisará ser serializado (JSON.stringify)
  // ou inserido em uma tabela separada. Usaremos JSON.stringify para simplificar.
  static async cadastrar({
    enunciado,
    alternativas,
    respostaCorreta,
    materia,
    dificuldade,
  }) {
    try {
      const sql = `
                INSERT INTO questoes 
                (enunciado, alternativas, resposta_correta, materia, dificuldade)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id
            `;

      // PostgreSQL armazena arrays como texto/JSON (string) ou JSONB.
      // Aqui, estamos convertendo para string JSON.
      const alternativasJson = JSON.stringify(alternativas);

      const values = [
        enunciado,
        alternativasJson,
        respostaCorreta,
        materia,
        dificuldade,
      ];

      const result = await pool.query(sql, values);
      return result.rows[0].id;
    } catch (err) {
      console.error("Erro ao cadastrar questão:", err.message);
      throw new Error("Erro ao cadastrar questão: " + err.message);
    }
  }

  // 2. LISTAR: Exemplo de listagem
  static async listar() {
    try {
      const result = await pool.query("SELECT * FROM questoes");

      // 💡 DESERIALIZAÇÃO: Se as alternativas foram salvas como JSON,
      // precisamos convertê-las de volta para um objeto JavaScript.
      return result.rows.map((row) => ({
        ...row,
        alternativas: row.alternativas ? JSON.parse(row.alternativas) : [],
      }));
    } catch (err) {
      console.error("Erro ao listar questões:", err);
      throw new Error("Erro interno ao listar questões.");
    }
  }
}

module.exports = Questao;
