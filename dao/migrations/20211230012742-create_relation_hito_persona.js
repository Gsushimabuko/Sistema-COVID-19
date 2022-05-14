'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.addColumn('Hito','personaId',{
      type: Sequelize.INTEGER,
      allowNull:true
   })

   await queryInterface.addConstraint('Hito',{
    fields : ['personaId'],
    type : 'FOREIGN KEY',
    name : 'FK_HITO_PERSONA',
    references :{ 
      table : 'Persona',
      field : 'id'
    }
  })

  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.removeConstraint('Hito','FK_HITO_PERSONA')
    await queryInterface.removeColumn('Hito','personaId')

  }
};
