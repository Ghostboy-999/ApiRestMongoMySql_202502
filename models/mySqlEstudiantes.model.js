const { DataTypes } = require('sequelize');
const { bdmysql, bdmysqlNube } = require('../database/mySqlConnection');


const Estudiantes = bdmysqlNube.define('estudiantes',
    {
        // Model attributes are defined here
        idestudiante: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },


        nombres: {
            type: DataTypes.STRING,
            allowNull: false
            // allowNull defaults to true
        },


        apellidos: {
            type: DataTypes.STRING,
            allowNull: false
            // allowNull defaults to true
        },
        estado: {
            type: DataTypes.ENUM('activo', 'inactivo'),
            //allowNull: false
            // allowNull defaults to true
        },
        idcarrera: {
            type: DataTypes.INTEGER
            // allowNull defaults to true
        }


    },


    {
        //Maintain table name don't plurilize
        freezeTableName: true,


        // I don't want createdAt
        createdAt: false,


        // I don't want updatedAt
        updatedAt: false
    }
);




module.exports = {
    Estudiantes,
}