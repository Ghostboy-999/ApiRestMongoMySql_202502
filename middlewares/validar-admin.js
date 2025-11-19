// middlewares/validar-admin.js

const validarAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      msg: "Debe validar el token primero",
    });
  }

  if (req.user.rol !== "ADMIN") {
    return res.status(403).json({
      msg: "Acceso denegado: se requiere rol ADMIN",
    });
  }

  next();
};

module.exports = {
  validarAdmin,
};
