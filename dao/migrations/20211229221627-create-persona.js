'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Persona', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dni: {
        type: Sequelize.STRING
      },
      nombre: {
        type: Sequelize.STRING
      },
      apellidop: {
        type: Sequelize.STRING
      },
      apellidom: {
        type: Sequelize.STRING
      },
      telefono: {
        type: Sequelize.STRING
      },
      estado: {
        type: Sequelize.INTEGER
      },
      esAlumno: {
        type: Sequelize.INTEGER
      },
      esApoderado: {
        type: Sequelize.INTEGER
      },
      esPersonal: {
        type: Sequelize.INTEGER
      },
      adentro: {
        type: Sequelize.INTEGER
      },
      am1: {
        type: Sequelize.INTEGER
      },
      am2: {
        type: Sequelize.INTEGER
      },
      am3: {
        type: Sequelize.INTEGER
      },
      am4: {
        type: Sequelize.INTEGER
      },
      am5: {
        type: Sequelize.INTEGER
      },
      am6: {
        type: Sequelize.INTEGER
      },
      am7: {
        type: Sequelize.INTEGER
      },
      otro: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Persona');
  }
};