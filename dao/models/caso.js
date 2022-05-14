'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Caso extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      Caso.belongsTo(models.Persona, {
        foreignKey : 'fichaId'
      })

    }
  };
  Caso.init({
    fecha: DataTypes.DATE,
    nombre: DataTypes.STRING,
    telefono: DataTypes.STRING,
    tipo: DataTypes.STRING,
    estado: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Caso',
    freezeTableName : true
  });
  return Caso;
};