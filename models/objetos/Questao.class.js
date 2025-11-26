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

  static async listar() {
    try {
      const result = await pool.query("SELECT * FROM questoes");

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
