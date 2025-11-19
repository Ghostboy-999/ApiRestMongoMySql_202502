const mongoose = require('mongoose')

const dbConnectionMongo = async() => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {});
    console.log(' Base de Datos de Mongo online...');
  } catch (error) {

    console.log(' Error al levantar la BD de MongoDb...');
    console.error(error);
    throw new Error('Error al levantar la BD de MongoDb...');
    
  }
};

module.exports  = {
    dbConnectionMongo
}