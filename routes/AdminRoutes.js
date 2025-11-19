const express = require("express");
const router = express.Router();
const adminController = require("../controllers/AdminController");

router.get("/admins", adminController.listarAdmins);
router.post("/cadadmin", adminController.cadastrarAdmin);

router.put("/materiais/:id", adminController.editarMaterial);
router.delete("/materiais/:id", adminController.deletarMaterial);

module.exports = router;