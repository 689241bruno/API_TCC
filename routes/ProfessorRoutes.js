const express = require("express");
const router = express.Router();
const professorController = require("../controllers/ProfessorController");

router.get("/professores", professorController.listarProfessores);
router.post("/cadprofessor", professorController.cadastrarProfessor);
router.put("/editprofessor/:id", professorController.editarProfessor);
router.delete("/delprofessor/:usuario_id", professorController.deletarProfessor);

module.exports = router;