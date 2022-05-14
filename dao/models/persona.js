'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Persona extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Persona.belongsTo(models.Area, {
        foreignKey : 'areaId'
      })

      Persona.belongsTo(models.Familia, {
        foreignKey : 'familiaId'
      })

      Persona.belongsTo(models.Grupo, {
        foreignKey : 'grupoId'
      })

     Persona.belongsTo(models.Persona, {
        foreignKey : 'apoderadomId'
      })

    Persona.belongsTo(models.Persona, {
        foreignKey : 'apoderadopId'
    })

    }
  };
  Persona.init({
    dni: DataTypes.STRING,
    nombre: DataTypes.STRING,
    apellidop: DataTypes.STRING,
    apellidom: DataTypes.STRING,
    telefono: DataTypes.STRING,
    estado: DataTypes.INTEGER,
    esAlumno: DataTypes.INTEGER,
    esApoderado: DataTypes.INTEGER,
    esPersonal: DataTypes.INTEGER,
    adentro: DataTypes.INTEGER,
    am1: DataTypes.INTEGER,
    am2: DataTypes.INTEGER,
    am3: DataTypes.INTEGER,
    am4: DataTypes.INTEGER,
    am5: DataTypes.INTEGER,
    am6: DataTypes.INTEGER,
    am7: DataTypes.INTEGER,
    otro: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Persona',
    freezeTableName: true
  });
  return Persona;
};