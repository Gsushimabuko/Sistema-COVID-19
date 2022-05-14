'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ficha extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      Ficha.belongsTo(models.Persona, {
        foreignKey : 'personaId'
      })

    }
  };
  Ficha.init({
    tipoSalida: DataTypes.INTEGER,
    fechaIngreso: DataTypes.STRING,
    ef1: DataTypes.INTEGER,
    ef2: DataTypes.INTEGER,
    ef3: DataTypes.INTEGER,
    ef4: DataTypes.INTEGER,
    ef5: DataTypes.INTEGER,
    ef6: DataTypes.INTEGER,
    ef7: DataTypes.INTEGER,
    ef1: DataTypes.INTEGER,
    ef8: DataTypes.INTEGER,
    ef9: DataTypes.INTEGER,
    ef10: DataTypes.INTEGER,
    ef11: DataTypes.INTEGER,
    ef12: DataTypes.INTEGER,
    friesgo: DataTypes.INTEGER,
    a1: DataTypes.INTEGER,
    a2: DataTypes.INTEGER,
    a3: DataTypes.INTEGER,
    a4: DataTypes.INTEGER,
    a5: DataTypes.INTEGER,
    a6: DataTypes.INTEGER,
    a7: DataTypes.INTEGER,
    a8: DataTypes.INTEGER,
    a9: DataTypes.INTEGER,
    a10: DataTypes.INTEGER,
    a11: DataTypes.INTEGER,
    a12: DataTypes.INTEGER,
    medicamento: DataTypes.STRING,
    prueba: DataTypes.INTEGER,
    porPersonal: DataTypes.INTEGER,
    archivos: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Ficha',
    freezeTableName:true
  });
  return Ficha;
};