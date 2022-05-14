'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.addColumn('Persona','apoderadomId',{
      type: Sequelize.INTEGER,
      allowNull:true
   })
   

   await queryInterface.addConstraint('Persona',{
    fields : ['apoderadomId'],
    type : 'FOREIGN KEY',
    name : 'FK_PERSONA_PERSONAAPODERADOM',
    references :{ 
      table : 'Persona',
      field : 'id'
    }
   })

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeConstraint('Persona','FK_PERSONA_PERSONAAPODERADOM')
    await queryInterface.removeColumn('Persona','apoderadomId')


  }
};
