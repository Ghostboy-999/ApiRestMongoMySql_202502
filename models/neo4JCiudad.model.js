const { driver } = require('../database/myNeo4jConnection');

class Ciudad {
  static label = 'Ciudad';

  static async create({ id, nombre, poblacion, latitud, longitud, pais_id }) {
    const session = driver.session();
    try {
      await session.run(
        `MERGE (c:${this.label} {id: $id})
         SET c.nombre = $nombre,
             c.poblacion = $poblacion,
             c.latitud = $latitud,
             c.longitud = $longitud`,
        { id, nombre, poblacion, latitud, longitud }
      );

      await session.run(
        `MATCH (c:${this.label} {id: $id}), (p:Pais {id: $pais_id})
         MERGE (c)-[:PERTENECE_A]->(p)`,
        { id, pais_id }
      );

      return { message: 'Ciudad creada o actualizada' };
    } finally {
      await session.close();
    }
  }

  static async findAll() {
    const session = driver.session();
    const result = await session.run(`MATCH (c:${this.label}) RETURN c`);
    await session.close();
    return result.records.map((r) => r.get('c').properties);
  }
}

module.exports = Ciudad;
