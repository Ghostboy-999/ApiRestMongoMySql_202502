const { driver } = require('../database/myNeo4jConnection');

class Famoso {
  static label = 'Famoso';

  static async create({ id, nombre, actividad, fecha_nacimiento, ciudad_id }) {
    const session = driver.session();
    try {
      await session.run(
        `MERGE (f:${this.label} {id: $id})
         SET f.nombre = $nombre,
             f.actividad = $actividad,
             f.fecha_nacimiento = $fecha_nacimiento`,
        { id, nombre, actividad, fecha_nacimiento }
      );

      await session.run(
        `MATCH (f:${this.label} {id: $id}), (c:Ciudad {id: $ciudad_id})
         MERGE (f)-[:NACE_EN]->(c)`,
        { id, ciudad_id }
      );

      return { message: 'Famoso creado o actualizado' };
    } finally {
      await session.close();
    }
  }

  static async findAll() {
    const session = driver.session();
    const result = await session.run(`MATCH (f:${this.label}) RETURN f`);
    await session.close();
    return result.records.map((r) => r.get('f').properties);
  }
}


module.exports = Famoso;
