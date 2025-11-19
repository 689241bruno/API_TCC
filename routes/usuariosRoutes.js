const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuariosController");
const upload = require("../middleware/upload");

router.get("/usuarios", usuarioController.listarUsuarios);
router.post("/cadusuario", usuarioController.criarUsuario);
router.post("/login", usuarioController.login);

router.delete("/delusuario", usuarioController.deletarUsuario);

router.put("/editusuario", usuarioController.editarUsuario);
router.get("/usuario/:id", usuarioController.buscarPorId);

router.get("/verificar-tipo", usuarioController.verificarTipo);
router.get("/check-user", usuarioController.checkUser);
router.get("/check-user-pass", usuarioController.checkUserPass);
router.post("/recuperar-senha", usuarioController.recuperarSenha);

module.exports = router;