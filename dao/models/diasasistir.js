'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DiasAsistir extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      DiasAsistir.belongsTo(models.Persona, {
        foreignKey : 'personaId'
      })

    }
  };
  DiasAsistir.init({
    fecha: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'DiasAsistir',
    freezeTableName : true
  });
  return DiasAsistir;
};