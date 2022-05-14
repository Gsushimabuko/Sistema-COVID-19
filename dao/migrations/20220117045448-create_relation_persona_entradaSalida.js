'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.addColumn('EntradaSalida','personaId',{
      type: Sequelize.INTEGER,
      allowNull:true
   })

   await queryInterface.addConstraint('EntradaSalida',{
    fields : ['personaId'],
    type : 'FOREIGN KEY',
    name : 'FK_ENTRADASALIDA_PERSONA',
    references :{ 
      table : 'Persona',
      field : 'id'
    }
  })
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeConstraint('Persona','FK_ENTRADASALIDA_PERSONA')
    await queryInterface.removeColumn('Persona','personaId')

  }
};
