const { driver } = require('../database/myNeo4jConnection');

class Plato {
  static label = 'Plato';

  static async create({ id, nombre, tipo, precio, descripcion, ciudad_id }) {
    const session = driver.session();
    try {
      await session.run(
        `MERGE (p:${this.label} {id: $id})
         SET p.nombre = $nombre,
             p.tipo = $tipo,
             p.precio = $precio,
             p.descripcion = $descripcion`,
        { id, nombre, tipo, precio, descripcion }
      );

      await session.run(
        `MATCH (p:${this.label} {id: $id}), (c:Ciudad {id: $ciudad_id})
         MERGE (p)-[:ORIGINARIO_DE]->(c)`,
        { id, ciudad_id }
      );

      return { message: 'Plato creado o actualizado' };
    } finally {
      await session.close();
    }
  }

  static async findAll() {
    const session = driver.session();
    const result = await session.run(`MATCH (p:${this.label}) RETURN p`);
    await session.close();
    return result.records.map((r) => r.get('p').properties);
  }
}

module.exports = Plato;
