const pool = require("../../config/db");

class Flashcard {
  constructor(
    id,
    usuario_id,
    pergunta,
    resposta,
    materia,
    ultimaRevisao = new Date(),
    proximaRevisao = null,
    repeticoes = 4,
    dificuldade = 2.5
  ) {
    this.id = id;
    this.usuario_id = usuario_id;
    this.pergunta = pergunta;
    this.resposta = resposta;
    this.materia = materia;
    this.ultimaRevisao = ultimaRevisao;
    this.proximaRevisao = proximaRevisao;
    this.repeticoes = repeticoes;
    this.dificuldade = dificuldade;
  }

  static async listar(usuario_id) {
    try {
      const result = await pool.query(
        "SELECT * FROM flashcards WHERE usuario_id = $1",
        [usuario_id]
      );
      return result.rows;
    } catch (err) {
      console.error("Erro ao listar Flashcards:", err);
      throw new Error("Erro interno ao listar Flashcards.");
    }
  }

  static async criar(
    usuario_id,
    pergunta,
    resposta,
    materia,
    repeticoes = 4,
    dificuldade = 2.5
  ) {
    try {
      const ultimaRevisao = new Date();
      const proximaRevisao = null;

      const sql = `
                INSERT INTO flashcards 
                (usuario_id, pergunta, resposta, materia, ultima_revisao, proxima_revisao, repeticoes, dificuldade)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id
            `;
      const values = [
        usuario_id,
        pergunta,
        resposta,
        materia,
        ultimaRevisao,
        proximaRevisao,
        repeticoes,
        dificuldade,
      ];

      const result = await pool.query(sql, values);

      return result.rows[0].id;
    } catch (err) {
      console.error("Erro ao criar Flashcard: ", err.message);
      throw new Error("Erro ao criar Flashcard.");
    }
  }

  static async editar(id, dados) {
    try {
      const {
        pergunta,
        resposta,
        materia,
        proximaRevisao,
        repeticoes,
        dificuldade,
      } = dados;

      const sql = `
                UPDATE flashcards 
                SET pergunta = $1, resposta = $2, materia = $3, proxima_revisao = $4, repeticoes = $5, dificuldade = $6
                WHERE id = $7
            `;
      const values = [
        pergunta,
        resposta,
        materia,
        proximaRevisao,
        repeticoes,
        dificuldade,
        id,
      ];

      await pool.query(sql, values);
      return true;
    } catch (err) {
      console.error("Erro ao editar Flashcard:", err);
      throw new Error("Erro interno ao editar Flashcard.");
    }
  }

  static async deletar(id) {
    try {
      await pool.query("DELETE FROM flashcards WHERE id = $1", [id]);
      return true;
    } catch (err) {
      console.error("Erro ao deletar Flashcard:", err);
      throw new Error("Erro interno ao deletar Flashcard.");
    }
  }

  static async revisar(id) {
    try {
      const result = await pool.query(
        "SELECT repeticoes FROM flashcards WHERE id = $1",
        [id]
      );
      const flashcards = result.rows;

      if (flashcards.length === 0) {
        throw new Error("Flashcard não encontrado!");
      }

      const flashcard = flashcards[0];
      const repeticoes = flashcard.repeticoes || 4;

      const diasEntreRevisoes = Math.floor(30 / repeticoes);
      const agora = new Date();
      const proximaRevisao = new Date();
      proximaRevisao.setDate(agora.getDate() + diasEntreRevisoes);

      const sql = `
                UPDATE flashcards
                SET ultima_revisao = $1, proxima_revisao = $2
                WHERE id = $3
            `;
      const values = [agora, proximaRevisao, id];

      await pool.query(sql, values);

      return { proximaRevisao, diasEntreRevisoes };
    } catch (err) {
      console.error("Erro ao revisar flashcard: ", err.message);
      throw new Error("Erro ao revisar flashcard.");
    }
  }
}

module.exports = Flashcard;
