const { driver } = require('../database/myNeo4jConnection');

// --------------------------------------------------
// Crear una ciudad
// --------------------------------------------------
const createCiudad = async (req, res) => {
  const session = driver.session();

  try {
    const { id, nombre, poblacion, latitud, longitud } = req.body;

    if (!id || !nombre) {
      return res.status(400).json({ error: "id y nombre son obligatorios" });
    }

    const cypher = `
      CREATE (c:Ciudad {
        id: $id,
        nombre: $nombre,
        poblacion: $poblacion,
        latitud: $latitud,
        longitud: $longitud
      })
      RETURN c
    `;

    const result = await session.run(cypher, {
      id,
      nombre,
      poblacion,
      latitud,
      longitud
    });

    res.status(201).json(result.records[0].get("c").properties);

  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
};

// --------------------------------------------------
// Obtener todas las ciudades
// --------------------------------------------------
const getCiudades = async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(`MATCH (c:Ciudad) RETURN c`);

    const ciudades = result.records.map(r => r.get("c").properties);

    res.json(ciudades);

  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
};

// --------------------------------------------------
// Obtener ciudad por ID
// --------------------------------------------------
const getCiudadById = async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (c:Ciudad {id: $id}) RETURN c`,
      { id: req.params.id }
    );

    if (!result.records.length) {
      return res.status(404).json({ message: "Ciudad no encontrada" });
    }

    res.json(result.records[0].get("c").properties);

  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
};

// --------------------------------------------------
// Actualizar ciudad
// --------------------------------------------------
const updateCiudad = async (req, res) => {
  const session = driver.session();

  try {
    const { nombre, poblacion, latitud, longitud } = req.body;

    const cypher = `
      MATCH (c:Ciudad {id: $id})
      SET c.nombre = $nombre,
          c.poblacion = $poblacion,
          c.latitud = $latitud,
          c.longitud = $longitud
      RETURN c
    `;

    const result = await session.run(cypher, {
      id: req.params.id,
      nombre,
      poblacion,
      latitud,
      longitud
    });

    if (!result.records.length) {
      return res.status(404).json({ message: "Ciudad no encontrada" });
    }

    res.json(result.records[0].get("c").properties);

  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
};

// --------------------------------------------------
// Eliminar ciudad
// --------------------------------------------------
const deleteCiudad = async (req, res) => {
  const session = driver.session();

  try {
    await session.run(
      `MATCH (c:Ciudad {id: $id}) DETACH DELETE c`,
      { id: req.params.id }
    );

    res.json({ message: "Ciudad eliminada correctamente" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
};

module.exports = {
  createCiudad,
  getCiudades,
  getCiudadById,
  updateCiudad,
  deleteCiudad
};
