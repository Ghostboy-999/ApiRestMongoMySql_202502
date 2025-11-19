const Sitio = require("../models/neo4JSitio.model");
const { driver } = require('../database/myNeo4jConnection');

const createSitio = async (req, res) => {
  try {
    const result = await Sitio.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSitios = async (req, res) => {
  try {
    const sitios = await Sitio.findAll();
    res.json(sitios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSitioById = async (req, res) => {
  const session = driver.session();
  try {
    const id = Number(req.params.id);
    const result = await session.run(
      `MATCH (s:Sitio {id: $id}) RETURN s`,
      { id }
    );

    if (!result.records.length) {
      return res.status(404).json({ message: "Sitio no encontrado" });
    }
    res.json(result.records[0].get("s").properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
};

const updateSitio = async (req, res) => {
  const session = driver.session();
  try {
    const id = Number(req.params.id);
    const { nombre, tipo, descripcion } = req.body;

    await session.run(
      `MATCH (s:Sitio {id: $id})
       SET s.nombre = $nombre,
           s.tipo = $tipo,
           s.descripcion = $descripcion`,
      { id, nombre, tipo, descripcion }
    );

    res.json({ message: "Sitio actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
};

const deleteSitio = async (req, res) => {
  const session = driver.session();
  try {
    const id = Number(req.params.id);

    // Primero borramos relaciones
    await session.run(`MATCH (s:Sitio {id: $id}) DETACH DELETE s`, { id });

    res.json({ message: "Sitio eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
};



// Registrar visita a un sitio
const registrarVisita = async (req, res) => {
  const session = driver.session();
  try {
    // Convertir a Number
    const userId = req.body.userId;
    const sitioId = Number(req.body.sitioId);
    const fecha_hora = req.body.fecha_hora;

    const query = `
      MATCH (u:User {id: $userId}), (s:Sitio {id: $sitioId})
      CREATE (u)-[:VISITO { fecha_hora: datetime($fecha_hora) }]->(s)
    `;

    await session.run(query, { userId, sitioId, fecha_hora });

    res.json({ ok: true, msg: "Visita registrada correctamente" });
  } catch (error) {
    console.error("Error al registrar visita:", error);
    res.status(500).json({ ok: false, msg: "Error al registrar visita", error });
  } finally {
    await session.close();
  }
};


const agregarFavorito = async (req, res) => {
  const session = driver.session();
  try {
    // Correcto: convertir cada id por separado
    const userId = req.body.userId;
    const sitioId = Number(req.body.sitioId);
    const fecha = req.body.fecha; // opcional

    if (!userId || !sitioId) {
      return res.status(400).json({ ok: false, msg: "userId y sitioId son obligatorios" });
    }

    const checkQuery = `
      MATCH (u:User {id: $userId})
      MATCH (s:Sitio {id: $sitioId})
      RETURN u, s
    `;

    const checkRes = await session.run(checkQuery, { userId, sitioId });

    if (!checkRes.records.length) {
      return res.status(404).json({ ok: false, msg: "Usuario o Sitio no encontrado" });
    }

    const mergeQuery = fecha
      ? `
        MATCH (u:User {id: $userId}), (s:Sitio {id: $sitioId})
        MERGE (u)-[f:FAVORITO]->(s)
        ON CREATE SET f.fecha = date($fecha)
        RETURN f
      `
      : `
        MATCH (u:User {id: $userId}), (s:Sitio {id: $sitioId})
        MERGE (u)-[f:FAVORITO]->(s)
        ON CREATE SET f.fecha = date()
        RETURN f
      `;

    const mergeRes = await session.run(mergeQuery, { userId, sitioId, fecha });

    res.json({
      ok: true,
      msg: "Sitio agregado a favoritos correctamente",
      favorito: mergeRes.records[0].get("f").properties
    });

  } catch (error) {
    console.log("Error al agregar favorito:", error);
    res.status(500).json({ ok: false, msg: "Error al agregar favorito", error });
  } finally {
    await session.close();
  }
};

const getTopSitios = async (req, res) => {
  const pais = req.params.pais; // string, ej: "Colombia"
  const session = driver.session();

  try {
    const query = `
      MATCH (u:User)-[:VISITO]->(s:Sitio)
      WHERE u.pais = $pais
      RETURN s.nombre AS sitio, COUNT(u) AS visitas
      ORDER BY visitas DESC
      LIMIT 10
    `;
    const result = await session.run(query, { pais });
    const topSitios = result.records.map(r => r.toObject());
    res.json({ ok: true, topSitios });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Error obteniendo top sitios", error: error.message });
  } finally {
    await session.close();
  }
};
const getTopFavoritos = async (req, res) => {
  const session = driver.session();

  try {
    const query = `
      MATCH (u:User)-[f:FAVORITO]->(s:Sitio)
      RETURN s.nombre AS sitio,
             COUNT(f) AS vecesFavorito
      ORDER BY vecesFavorito DESC
      LIMIT 10
    `;

    const result = await session.run(query);
    const favoritos = result.records.map(r => r.toObject());

    res.json({ ok: true, favoritos });

  } catch (error) {
    res.status(500).json({ ok: false, msg: "Error obteniendo favoritos", error: error.message });
  } finally {
    await session.close();
  }
};





module.exports = {
  getSitios,
  getSitioById,
  createSitio,
  updateSitio,
  deleteSitio,
  registrarVisita, 
  agregarFavorito, 
  getTopSitios,
  getTopFavoritos
}
