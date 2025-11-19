const { driver } = require("../database/myNeo4jConnection");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");


const createUser = async (req, res) => {
  const { id, nombre, correo, password, rol = "USER", pais, ciudad, edad } = req.body;

  const session = driver.session();

  try {
    // Validación básica
    if (!id || !nombre || !correo || !password) {
      return res.status(400).json({
        ok: false,
        msg: "id, nombre, correo y password son obligatorios"
      });
    }

    // Verificar si el ID ya existe
    const idQuery = `
      MATCH (u:User { id: $id })
      RETURN u LIMIT 1
    `;
    const idResult = await session.run(idQuery, { id });

    if (idResult.records.length > 0) {
      return res.status(400).json({ ok: false, msg: "El ID ya está registrado" });
    }

    // Verificar si el correo ya existe
    const emailQuery = `
      MATCH (u:User { correo: $correo })
      RETURN u LIMIT 1
    `;
    const emailExists = await session.run(emailQuery, { correo });

    if (emailExists.records.length > 0) {
      return res.status(400).json({ ok: false, msg: "El correo ya está registrado" });
    }

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    const passwordHash = bcryptjs.hashSync(password, salt);

    // Crear el usuario
    const createQuery = `
      CREATE (u:User {
        id: $id,
        nombre: $nombre,
        correo: $correo,
        password: $password,
        rol: $rol,
        pais: $pais,
        ciudad: $ciudad,
        edad: $edad
      })
      RETURN u
    `;

    const result = await session.run(createQuery, {
      id,
      nombre,
      correo,
      password: passwordHash,
      rol: rol.toUpperCase(),
      pais,
      ciudad,
      edad
    });

    const newUser = result.records[0].get("u").properties;

    // Generar token
    const token = await generarJWT(newUser.id, newUser.nombre, newUser.rol);

    res.status(201).json({
      ok: true,
      msg: "Usuario creado correctamente",
      usuario: newUser,
      token
    });

  } catch (error) {
    console.error("Error creando usuario:", error);
    res.status(500).json({ ok: false, msg: "Error al crear usuario", error });
  } finally {
    await session.close();
  }
};


  



// ======================
// Obtener todos los usuarios
// ======================
const getUsers = async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(`MATCH (u:User) RETURN u`);
    const users = result.records.map(record => record.get('u').properties);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
};

// ======================
// Obtener un usuario por ID
// ======================
const getUserById = async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (u:User {id: $id}) RETURN u`,
      { id: req.params.id }
    );
    if (!result.records.length) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    res.json(result.records[0].get("u").properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
};

// ======================
// Actualizar usuario
// ======================
const updateUser = async (req, res) => {
  const { nombre, correo, password, rol, pais, ciudad, edad } = req.body;
  const session = driver.session();

  try {
    // Encriptar la contraseña si se envía una nueva
    let newPassword = password;
    if (password) {
      const salt = bcryptjs.genSaltSync();
      newPassword = bcryptjs.hashSync(password, salt);
    }

    await session.run(
      `
      MATCH (u:User {id: $id})
      SET u.nombre = $nombre,
          u.correo = $correo,
          u.password = $password,
          u.rol = $rol,
          u.pais = $pais,
          u.ciudad = $ciudad,
          u.edad = $edad
      `,
      {
        id: req.params.id,
        nombre,
        correo,
        password: newPassword,
        rol,
        pais,
        ciudad,
        edad
      }
    );

    res.json({ msg: "Usuario actualizado correctamente" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
};

// ======================
// Eliminar usuario
// ======================
const deleteUser = async (req, res) => {
  const session = driver.session();
  try {
    await session.run(
      `MATCH (u:User {id: $id}) DETACH DELETE u`,
      { id: req.params.id }
    );
    res.json({ msg: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
};

//4
const getTopUsuariosVisitantes = async (req, res) => {
  const session = driver.session();

  try {
    const query = `
      MATCH (u:User)-[v:VISITO]->(s:Sitio)
      RETURN u.nombre AS usuario,
             COUNT(v) AS totalVisitas
      ORDER BY totalVisitas DESC
      LIMIT 5
    `;

    const result = await session.run(query);

    const usuarios = result.records.map(r => r.toObject());

    res.json({ ok: true, usuarios });

  } catch (error) {
    res.status(500).json({ ok: false, msg: "Error obteniendo top usuarios", error: error.message });
  } finally {
    await session.close();
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getTopUsuariosVisitantes
};
