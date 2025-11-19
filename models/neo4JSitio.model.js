const { driver } = require('../database/myNeo4jConnection');

class Sitio {
  static label = 'Sitio';

  static async create({ id, nombre, tipo, descripcion, ciudad_id }) {
    const session = driver.session();
    try {
      await session.run(
        `MERGE (s:${this.label} {id: $id})
         SET s.nombre = $nombre,
             s.tipo = $tipo,
             s.descripcion = $descripcion`,
        { id, nombre, tipo, descripcion }
      );

      await session.run(
        `MATCH (s:${this.label} {id: $id}), (c:Ciudad {id: $ciudad_id})
         MERGE (s)-[:UBICADO_EN]->(c)`,
        { id, ciudad_id }
      );

      return { message: 'Sitio creado o actualizado' };
    } finally {
      await session.close();
    }
  }

  static async findAll() {
    const session = driver.session();
    const result = await session.run(`MATCH (s:${this.label}) RETURN s`);
    await session.close();
    return result.records.map((r) => r.get('s').properties);
  }
}

module.exports = Sitio;
