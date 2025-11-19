const Flashcard = require("../models/objetos/Flashcard.class");

exports.listarFlashcards = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        console.log("Requisição listarFlashcards:", { usuario_id });

        const flashcards = await Flashcard.listar(usuario_id);
        res.json(flashcards);
    } catch (err) {
        console.error("Erro ao listar flashcards:", err);
        res.status(500).json({ erro: "Erro ao listar flashcards." });
    }
};

exports.criarFlashcard = async (req, res) => {
    try {
        const { usuario_id, pergunta, resposta, materia, repeticoes, dificuldade } = req.body;

        if (!usuario_id || !pergunta || !resposta || !materia) {
            return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
        }

        console.log("Requisição criarFlashcard:", { usuario_id, materia, repeticoes });

        const novo = await Flashcard.criar(usuario_id, pergunta, resposta, materia, repeticoes, dificuldade);
        res.status(201).json({ mensagem: "Flashcard criado com sucesso!", flashcard: novo });
    } catch (err) {
        console.error("Erro ao criar flashcard:", err);
        res.status(500).json({ erro: "Erro ao criar flashcard." });
    }
};

exports.editarFlashcard = async (req, res) => {
    try {
        const { id } = req.params;
        const dados = req.body;
        console.log("Requisição editarFlashcard:", { id, dados });

        await Flashcard.editar(id, dados);
        res.json({ mensagem: "Flashcard atualizado com sucesso!" });
    } catch (err) {
        console.error("Erro ao editar flashcard:", err);
        res.status(500).json({ erro: "Erro ao editar flashcard." });
    }
};

exports.deletarFlashcard = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Requisição deletarFlashcard:", { id });

        await Flashcard.deletar(id);
        res.json({ mensagem: "Flashcard deletado com sucesso!" });
    } catch (err) {
        console.error("Erro ao deletar flashcard:", err);
        res.status(500).json({ erro: "Erro ao deletar flashcard." });
    }
};

exports.revisarFlashcard = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Requisição revisarFlashcard:", { id });

        const resultado = await Flashcard.revisar(id);
        res.json({ mensagem: "Revisão registrada com sucesso!", ...resultado });
    } catch (err) {
        console.error("Erro ao revisar flashcard:", err);
        res.status(500).json({ erro: "Erro ao revisar flashcard." });
    }
};
