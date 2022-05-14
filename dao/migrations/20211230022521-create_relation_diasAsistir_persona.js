'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.addColumn('DiasAsistir','personaId',{
      type: Sequelize.INTEGER,
      allowNull:true
   })

   await queryInterface.addConstraint('DiasAsistir',{
    fields : ['personaId'],
    type : 'FOREIGN KEY',
    name : 'FK_DIASASISTIR_PERSONA',
    references :{ 
      table : 'Persona',
      field : 'id'
    }
  })

  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.removeConstraint('DiasAsistir','FK_DIASASISTIR_PERSONA')
    await queryInterface.removeColumn('DiasAsistir','personaId')

  }
};
