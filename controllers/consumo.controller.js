const { driver } = require("../database/myNeo4jConnection"); 

const createConsumo = async (req, res) => {
  let { userId, platoId, sitioId, valor_pagado, fecha_consumo } = req.body;

  userId = userId;
  platoId = Number(platoId);
  sitioId = Number(sitioId);

  const session = driver.session();
  try {
    const query = `
      MATCH (u:User {id: $userId})
      MATCH (p:Plato {id: $platoId})
      MATCH (s:Sitio {id: $sitioId})
      CREATE (u)-[:CONSUMIO {
        valor_pagado: $valor_pagado,
        fecha_consumo: date($fecha_consumo)
      }]->(p)
      MERGE (p)-[:OFRECIDO_EN]->(s)
    `;

    await session.run(query, {
      userId,
      platoId,
      sitioId,
      valor_pagado,
      fecha_consumo,
    });

    res.json({ ok: true, msg: "Consumo registrado" });
  } catch (error) {
    console.error("Error en createConsumo:", error);
    res.status(500).json({ ok: false, msg: "Error al registrar consumo", error });
  } finally {
    await session.close();
  }
};

const getConsumosByUser = async (req, res) => {
  const { userId } = req.params;
  const session = driver.session();
  try {
    const query = `
      MATCH (u:User {id: $userId})-[c:CONSUMIO]->(p:Plato)-[:OFRECIDO_EN]->(s:Sitio)
      RETURN p.nombre AS plato, p.precio AS precio_base, 
             c.valor_pagado AS valor_pagado, c.fecha_consumo AS fecha,
             s.nombre AS sitio
    `;
    const result = await session.run(query, { userId });
    const consumos = result.records.map(record => record.toObject());
    res.json({ ok: true, consumos });
  } catch (error) {
    console.log("Error en getConsumosByUser:", error);
    res.status(500).json({ ok: false, msg: "Error al obtener consumos", error });
  } finally {
    await session.close();
  }
};



module.exports = { createConsumo, getConsumosByUser};