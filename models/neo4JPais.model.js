const { driver } = require('../database/myNeo4jConnection');
class Pais {
  static label = 'Pais';

  static async create({ id, nombre, poblacion, continente }) {
    const session = driver.session();
    try {
      await session.run(
        `MERGE (p:${this.label} {id: $id})
         SET p.nombre = $nombre,
             p.poblacion = $poblacion,
             p.continente = $continente`,
        { id, nombre, poblacion, continente }
      );
      return { message: 'País creado o actualizado' };
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

module.exports = Pais;
