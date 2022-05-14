'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Ficha', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tipoSalida: {
        type: Sequelize.INTEGER
      },
      fechaIngreso: {
        type: Sequelize.DATE
      },
      ef1: {
        type: Sequelize.INTEGER
      },
      ef2: {
        type: Sequelize.INTEGER
      },
      ef3: {
        type: Sequelize.INTEGER
      },
      ef4: {
        type: Sequelize.INTEGER
      },
      ef5: {
        type: Sequelize.INTEGER
      },
      ef6: {
        type: Sequelize.INTEGER
      },
      ef7: {
        type: Sequelize.INTEGER
      },
      ef8: {
        type: Sequelize.INTEGER
      },
      ef9: {
        type: Sequelize.INTEGER
      },
      ef10: {
        type: Sequelize.INTEGER
      },
      ef11: {
        type: Sequelize.INTEGER
      },
      ef12: {
        type: Sequelize.INTEGER
      },
      friesgo: {
        type: Sequelize.INTEGER
      },
      a1: {
        type: Sequelize.INTEGER
      },
      a2: {
        type: Sequelize.INTEGER
      },
      a3: {
        type: Sequelize.INTEGER
      },
      a4: {
        type: Sequelize.INTEGER
      },
      a5: {
        type: Sequelize.INTEGER
      },
      a6: {
        type: Sequelize.INTEGER
      },
      a7: {
        type: Sequelize.INTEGER
      },
      a8: {
        type: Sequelize.INTEGER
      },
      a9: {
        type: Sequelize.INTEGER
      },
      a10: {
        type: Sequelize.INTEGER
      },
      a11: {
        type: Sequelize.INTEGER
      },
      a12: {
        type: Sequelize.INTEGER
      },
      medicamento: {
        type: Sequelize.STRING
      },
      prueba: {
        type: Sequelize.INTEGER
      },
      porPersonal: {
        type: Sequelize.INTEGER
      },
      archivos: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Ficha');
  }
};