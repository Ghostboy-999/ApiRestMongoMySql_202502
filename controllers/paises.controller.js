const Pais = require("../models/neo4JPais.model");
const { driver } = require('../database/myNeo4jConnection');

const createPais = async (req, res) => {
  try {
    const result = await Pais.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPaises = async (req, res) => {
  try {
    const paises = await Pais.findAll();
    res.json(paises);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPaisById = async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (p:Pais {id: $id}) RETURN p`,
      { id: req.params.id }
    );
    if (!result.records.length) {
      return res.status(404).json({ message: 'País no encontrado' });
    }
    res.json(result.records[0].get("p").properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
};

const updatePais = async (req, res) => {
  const session = driver.session();
  try {
    const { nombre, poblacion, continente } = req.body;
    await session.run(
      `MATCH (p:Pais {id: $id})
       SET p.nombre = $nombre,
           p.poblacion = $poblacion,
           p.continente = $continente`,
      { id: req.params.id, nombre, poblacion, continente }
    );
    res.json({ message: 'País actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
};

const deletePais = async (req, res) => {
  const session = driver.session();
  try {
    await session.run(`MATCH (p:Pais {id: $id}) DETACH DELETE p`, { id: req.params.id });
    res.json({ message: 'País eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
};

module.exports = {
  createPais,
  getAllPaises,
  getPaisById,
  updatePais,
  deletePais
};
