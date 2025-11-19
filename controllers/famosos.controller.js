const Famoso = require("../models/neo4JFamoso.model");
const { driver } = require('../database/myNeo4jConnection');

const createFamoso = async (req, res) => {
  try {
    const result = await Famoso.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFamosos = async (req, res) => {
  try {
    const famosos = await Famoso.findAll();
    res.json(famosos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const getFamosoById = async (req, res) => {
  const session = driver.session();

  try {
    const id = Number(req.params.id); // convertir param

    if (isNaN(id)) {
      return res.status(400).json({ ok: false, msg: "El ID debe ser numérico" });
    }

    const query = `
      MATCH (f:Famoso)
      WHERE f.id = toInteger($id)
      RETURN f
    `;

    const result = await session.run(query, { id });

    if (result.records.length === 0) {
      return res.status(404).json({ ok: false, msg: "Famoso no encontrado" });
    }

    const famoso = result.records[0].get("f").properties;

    // Convertir el ID Neo4j a número normal
    famoso.id = famoso.id.low;

    res.json({
      ok: true,
      famoso
    });

  } catch (error) {
    console.error("Error buscando famoso:", error);
    res.status(500).json({ ok: false, error: error.message });
  } finally {
    await session.close();
  }
};

const updateFamoso = async (req, res) => {
  const session = driver.session();
  try {
    const { nombre, actividad, fecha_nacimiento } = req.body;
    await session.run(
      `MATCH (f:Famoso {id: $id})
       SET f.nombre = $nombre,
           f.actividad = $actividad,
           f.fecha_nacimiento = $fecha_nacimiento`,
      { id: req.params.id, nombre, actividad, fecha_nacimiento }
    );
    res.json({ message: 'Famoso actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
};

const deleteFamoso = async (req, res) => {
  const session = driver.session();
  try {
    const id = req.params.id;

    // Verificar si existe
    const check = await session.run(
      `MATCH (f:Famoso {id: $id}) RETURN f`,
      { id }
    );

    if (!check.records.length) {
      return res.status(404).json({ ok: false, msg: "Famoso no encontrado" });
    }

    // Eliminar con DETACH DELETE
    await session.run(
      `MATCH (f:Famoso {id: $id}) DETACH DELETE f`,
      { id }
    );

    res.json({ ok: true, msg: "Famoso eliminado correctamente" });

  } catch (error) {
    console.error("Error eliminando famoso:", error);
    res.status(500).json({ ok: false, msg: "Error al eliminar famoso", error: error.message });
  } finally {
    await session.close();
  }
};

const registrarTag = async (req, res) => {
  const { userId, famosoId, sitioId, fecha } = req.body;
  const session = driver.session();
  try {
    const query = `
      MATCH (u:User {id: $userId}), (f:Famoso {id: $famosoId}), (s:Sitio {id: $sitioId})
      CREATE (u)-[:FOTOGRAFIADO_CON {fecha: date($fecha), sitioId: $sitioId}]->(f)
    `;
    await session.run(query, { userId, famosoId, sitioId, fecha });
    res.json({ ok: true, msg: "Fotografía registrada" });
  } catch (error) {
    console.log("Error en registrarTag:", error);
    res.status(500).json({ ok: false, msg: "Error al registrar Tag", error });
  } finally {
    await session.close();
  }
};







module.exports = {
  getFamosos,
  getFamosoById,
  createFamoso,
  updateFamoso,
  deleteFamoso,
  registrarTag
};
