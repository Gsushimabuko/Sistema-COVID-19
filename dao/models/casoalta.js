'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CasoAlta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      CasoAlta.belongsTo(models.CasoPositivo, {
        foreignKey : 'casoPositivoId'
      })

    }
  };
  CasoAlta.init({
    fechaIngreso: DataTypes.DATE,
    idPersona: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CasoAlta',
    freezeTableName : true
  });
  return CasoAlta;
};