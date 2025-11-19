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

    // Listar todos os flashcards
    static async listar(usuario_id) {
        const [rows] = await pool.query(
            "SELECT * FROM flashcards WHERE usuario_id = ?",
            [usuario_id]
        );
        return rows;
    }

    // Criar flashcard
    static async criar(usuario_id, pergunta, resposta, materia, repeticoes = 4, dificuldade = 2.5) {
        try {
            const ultimaRevisao = new Date();
            const proximaRevisao = null;

            const [result] = await pool.query(
                `INSERT INTO flashcards 
                (usuario_id, pergunta, resposta, materia, ultima_revisao, proxima_revisao, repeticoes, dificuldade)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [usuario_id, pergunta, resposta, materia, ultimaRevisao, proximaRevisao, repeticoes, dificuldade]
            );

            return result.insertId;
        } catch (err) {
            console.error("Erro ao criar Flashcard: ", err.sqlMessage || err.message);
            throw new Error("Erro ao criar Flashcard.");
        }
    }

    // Editar flashcard
    static async editar(id, dados) {
        const { pergunta, resposta, materia, proximaRevisao, repeticoes, dificuldade } = dados;
        await pool.query(
            `UPDATE flashcards 
             SET pergunta = ?, resposta = ?, materia = ?, proxima_revisao = ?, repeticoes = ?, dificuldade = ?
             WHERE id = ?`,
            [pergunta, resposta, materia, proximaRevisao, repeticoes, dificuldade, id]
        );
        return true;
    }

    // Deletar flashcard
    static async deletar(id) {
        await pool.query("DELETE FROM flashcards WHERE id = ?", [id]);
        return true;
    }

    // Revisar flashcard
    static async revisar(id) {
        try {
            const [flashcards] = await pool.query("SELECT repeticoes FROM flashcards WHERE id = ?", [id]);

            if (flashcards.length === 0) {
                throw new Error("Flashcard não encontrado!");
            }

            const flashcard = flashcards[0];
            const repeticoes = flashcard.repeticoes || 4;

            // cálculo da nova revisão baseado na quantidade de repetições
            const diasEntreRevisoes = Math.floor(30 / repeticoes);
            const agora = new Date();
            const proximaRevisao = new Date();
            proximaRevisao.setDate(agora.getDate() + diasEntreRevisoes);

            await pool.query(
                `UPDATE flashcards
                 SET ultima_revisao = ?, proxima_revisao = ?
                 WHERE id = ?`,
                [agora, proximaRevisao, id]
            );

            return { proximaRevisao, diasEntreRevisoes };
        } catch (err) {
            console.error("Erro ao revisar flashcard: ", err.message);
            throw new Error("Erro ao revisar flashcard.");
        }
    }
}

module.exports = Flashcard;
