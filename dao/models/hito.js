'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hito extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      Hito.belongsTo(models.Persona, {
        foreignKey : 'personaId'
      })

    }
  };
  Hito.init({
    fecha: DataTypes.DATE,
    titulo: DataTypes.STRING,
    descripcion: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Hito',
    freezeTableName: true
  });
  return Hito;
};