'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.addColumn('Persona','apoderadopId',{
      type: Sequelize.INTEGER,
      allowNull:true
   })
   

   await queryInterface.addConstraint('Persona',{
    fields : ['apoderadopId'],
    type : 'FOREIGN KEY',
    name : 'FK_PERSONA_PERSONAAPODERADOP',
    references :{ 
      table : 'Persona',
      field : 'id'
    }
   })

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeConstraint('Persona','FK_PERSONA_PERSONAAPODERADOP')
    await queryInterface.removeColumn('Persona','apoderadopId')


  }
};
