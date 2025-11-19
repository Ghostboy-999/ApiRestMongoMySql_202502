require('dotenv').config();
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(
    process.env.NEO4J_USER,
    process.env.NEO4J_PASSWORD
  ),
  { disableLosslessIntegers: true }
);

const dbConnectionNeo4j = async () => {
  try {
    await driver.getServerInfo();
    console.log("🔥 Conectado exitosamente a AuraDB");
  } catch (err) {
    console.error("❌ Error conectando a AuraDB:");
    console.error(err);
  }
};

module.exports = { driver, dbConnectionNeo4j };
