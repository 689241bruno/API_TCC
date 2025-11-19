const express = require("express");
const router = express.Router();
const FlashcardController = require("../controllers/FlashcardController");

// Rotas de Flashcards
router.get("/listar/:usuario_id", FlashcardController.listarFlashcards);
router.post("/criar", FlashcardController.criarFlashcard);
router.put("/editar/:id", FlashcardController.editarFlashcard);
router.delete("/deletar/:id", FlashcardController.deletarFlashcard);
router.put("/revisar/:id", FlashcardController.revisarFlashcard);

module.exports = router;
