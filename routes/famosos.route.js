const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarAdmin } = require("../middlewares/validar-admin");
const {
  getFamosos,
  getFamosoById,
  createFamoso,
  updateFamoso,
  deleteFamoso,
  registrarTag,
 
} = require("../controllers/famosos.controller");

const router = Router();

router.get("/", validarJWT, getFamosos);
router.get("/:id", validarJWT, getFamosoById);



// SOLO ADMIN
router.post("/", validarJWT, validarAdmin, createFamoso);
router.put("/:id", validarJWT, validarAdmin, updateFamoso);
router.delete("/:id", validarJWT, validarAdmin, deleteFamoso);
router.post("/tag", validarJWT, registrarTag);

module.exports = router;
