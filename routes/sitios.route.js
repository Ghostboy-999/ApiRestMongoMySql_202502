const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarAdmin } = require("../middlewares/validar-admin");
const {
  getSitios,
  getSitioById,
  createSitio,
  updateSitio,
  deleteSitio,
  registrarVisita,
  agregarFavorito,
  getTopSitios,
  getTopFavoritos
} = require("../controllers/sitios.controller");

const router = Router();



router.get("/", validarJWT, getSitios);
router.get("/:id", validarJWT, getSitioById);


router.post("/", validarJWT, validarAdmin, createSitio);
router.put("/:id", validarJWT, validarAdmin, updateSitio);
router.delete("/:id", validarJWT, validarAdmin, deleteSitio);

router.post("/visitas", validarJWT, registrarVisita);
router.post("/favorito", validarJWT, agregarFavorito);
router.get("/top-sitios/:pais", validarJWT, getTopSitios);
router.get("/favoritos/top", getTopFavoritos);

module.exports = router;
