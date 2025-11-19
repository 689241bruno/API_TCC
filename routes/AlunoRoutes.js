const express = require("express");
const router = express.Router();
const AlunoController = require("../controllers/AlunoController");

router.get("/listar", AlunoController.listarAlunos);
router.post("/cadastrar", AlunoController.cadastrarAluno);
router.put("/editar/:usuario_id", AlunoController.editarAluno);
router.delete("/deletar/:usuario_id", AlunoController.deletarAluno);
router.get("/buscar/:usuario_id", AlunoController.buscarAlunoPorId);
router.put("/modo-intensivo/:usuario_id", AlunoController.ativarModoIntensivo);
router.get("/ranking/:usuario_id", AlunoController.checkRanking);
router.put("/addxp/:usuario_id", AlunoController.addXp);

module.exports = router;