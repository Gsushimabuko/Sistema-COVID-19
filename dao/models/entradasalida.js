'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EntradaSalida extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      EntradaSalida.belongsTo(models.Persona, {
        foreignKey : 'personaId'
      })
      
    }
  };
  EntradaSalida.init({
    fechaHora: DataTypes.DATE,
    estado: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'EntradaSalida',
    freezeTableName : true
  });
  return EntradaSalida;
};