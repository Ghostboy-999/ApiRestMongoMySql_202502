const { driver } = require('../database/myNeo4jConnection');

class User {
  static label = 'User';

  static async create(userData) {
    const session = driver.session();
    try {
      await session.run(
        `MERGE (u:${this.label} {id: $id})
         SET u.nombre = $nombre,
             u.correo = $correo,
             u.password = $password,
             u.rol = $rol,
             u.pais = $pais,
             u.ciudad = $ciudad,
             u.edad = $edad`,
        userData
      );
      return { message: 'Usuario creado o actualizado' };
    } finally {
      await session.close();
    }
  }

  static async findByEmail(correo) {
    const session = driver.session();
    const result = await session.run(
      `MATCH (u:${this.label} {correo: $correo}) RETURN u`,
      { correo }
    );
    await session.close();
    return result.records.length ? result.records[0].get('u').properties : null;
  }
}

module.exports = User;
