'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CasoPositivo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  CasoPositivo.init({
    fechaDetectado: DataTypes.DATE,
    fechaAltaProbable: DataTypes.DATE,
    fechaAltaReal: DataTypes.DATE,
    idPersona: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CasoPositivo',
    freezeTableName : true
  });
  return CasoPositivo;
};