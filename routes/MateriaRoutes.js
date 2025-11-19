const express = require("express");
const router = express.Router();
const materiasController = require("../controllers/MateriaController");
const upload = require("../middleware/upload");

router.get("/materias", materiasController.listar);
router.get("/materias/:materia", materiasController.listarMaterias);
router.post("/materias/publicar", upload.single("arquivo"), materiasController.publicarMateria);
router.post("/materias/progresso", materiasController.atualizarProgresso);
router.get("/materias/progresso/:idUsuario", materiasController.listarProgressoUsuario);
router.get("/materias/pdf/:id", materiasController.verPDF);

module.exports = router;
