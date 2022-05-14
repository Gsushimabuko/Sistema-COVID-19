'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CasoPositivo', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fechaDetectado: {
        type: Sequelize.DATE
      },
      fechaAltaProbable:{
        type: Sequelize.DATE
      },
    fechaAltaReal: {
      type: Sequelize.DATE
    },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      idPersona : {
        allowNull: true,
        type: Sequelize.INTEGER
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CasoPositivo');
  }
};