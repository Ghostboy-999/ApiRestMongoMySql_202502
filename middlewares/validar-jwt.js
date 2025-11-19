const jwt = require("jsonwebtoken");

const validarJWT = (req, res, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({ msg: "No hay token" });
  }

  try {
    const { uid, nombre, rol } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    req.uid = uid;
    req.nombre = nombre;
    req.rol = rol;

    req.user = { uid, nombre, rol };

    next();

  } catch (error) {
    res.status(401).json({ msg: "Token inválido" });
  }
};

module.exports = { validarJWT };
