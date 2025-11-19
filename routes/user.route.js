const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarAdmin } = require("../middlewares/validar-admin");

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getTopUsuariosVisitantes
} = require("../controllers/user.controller");


const router = Router();

router.post("/", createUser); 
router.get("/", validarJWT, validarAdmin, getUsers);
router.get("/:id", validarJWT, getUserById);
router.put("/:id", validarJWT, updateUser);
router.delete("/:id", validarJWT, validarAdmin, deleteUser);
router.get("/top-usuarios", validarJWT, getTopUsuariosVisitantes);


module.exports = router;
