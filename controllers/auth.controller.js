const { driver } = require("../database/myNeo4jConnection");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");

// ======================
// Login de Usuario
// ======================
const login = async (req, res) => {
  const { correo, password } = req.body;
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (u:User {correo: $correo})
      RETURN u
      `,
      { correo }
    );

    if (!result.records.length) {
      return res.status(400).json({ msg: "Usuario o contraseña incorrectos" });
    }

    const user = result.records[0].get("u").properties;

    // Verificar contraseña
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ msg: "Usuario o contraseña incorrectos" });
    }

    // Generar JWT
    const token = await generarJWT(user.uid, user.nombre, user.rol);

    res.json({
      msg: "Login exitoso",
      user,
      token
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
};

module.exports = {
  login
};
