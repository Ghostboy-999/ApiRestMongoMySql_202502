const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const { createConsumo,getConsumosByUser
} = require("../controllers/consumo.controller");

const router = Router();

router.post("/", validarJWT, createConsumo);
router.get("/:userId", validarJWT, getConsumosByUser);


module.exports = router;