const Plato = require("../models/neo4JPlato.model");
const { driver } = require('../database/myNeo4jConnection');

const createPlato = async (req, res) => {
  try {
    const result = await Plato.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPlatos = async (req, res) => {
  try {
    const platos = await Plato.findAll();
    res.json(platos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPlatoById = async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (p:Plato {id: $id}) RETURN p`,
      { id: req.params.id }
    );
    if (!result.records.length) {
      return res.status(404).json({ message: 'Plato no encontrado' });
    }
    res.json(result.records[0].get("p").properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
};

const updatePlato = async (req, res) => {
  const session = driver.session();
  try {
    const { nombre, tipo, precio, descripcion } = req.body;
    await session.run(
      `MATCH (p:Plato {id: $id})
       SET p.nombre = $nombre,
           p.tipo = $tipo,
           p.precio = $precio,
           p.descripcion = $descripcion`,
      { id: req.params.id, nombre, tipo, precio, descripcion }
    );
    res.json({ message: 'Plato actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
};

const deletePlato = async (req, res) => {
  const session = driver.session();
  try {
    await session.run(`MATCH (p:Plato {id: $id}) DETACH DELETE p`, { id: req.params.id });
    res.json({ message: 'Plato eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
};

module.exports = {
  createPlato,
  getAllPlatos,
  getPlatoById,
  updatePlato,
  deletePlato
};
