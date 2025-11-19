const express = require('express');
const router = express.Router();
const PlanoEstudos = require('../controllers/PlanoEstudosController');

router.get("/plano/:usuario_id", PlanoEstudos.listarTarefas);
router.post("/plano", PlanoEstudos.criarTarefa);
router.put("/plano/:id", PlanoEstudos.editarTarefa);
router.delete("/plano/:id", PlanoEstudos.deletarTarefa);

module.exports = router;