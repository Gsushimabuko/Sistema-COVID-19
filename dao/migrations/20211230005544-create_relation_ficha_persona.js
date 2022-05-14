'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
  
      await queryInterface.addColumn('Ficha','personaId',{
        type: Sequelize.INTEGER,
        allowNull:true
     })
  
     await queryInterface.addConstraint('Ficha',{
      fields : ['personaId'],
      type : 'FOREIGN KEY',
      name : 'FK_FICHA_PERSONA',
      references :{ 
        table : 'Persona',
        field : 'id'
      }
    })

  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.removeConstraint('Ficha','FK_FICHA_PERSONAA')
    await queryInterface.removeColumn('Ficha','personaId')

  }
};
