const express = require("express");
const router = express.Router();
const DesafiosController = require("../controllers/DesafiosController");
const Desafios = require("../models/objetos/Desafios.class");

// CRUD desafios
router.get("/listar", DesafiosController.listarDesafios);
router.post("/criar", DesafiosController.criarDesafio);
router.put("/editar/:id", DesafiosController.editarDesafio);
router.delete("/deletar/:id", DesafiosController.deletarDesafio);

// Progresso
router.post("/progresso", DesafiosController.registrarProgresso);
router.get("/progresso/:usuario_id", DesafiosController.listarProgressoUsuario);
router.put("/progresso/concluido", DesafiosController.marcarConcluida);

module.exports = router;