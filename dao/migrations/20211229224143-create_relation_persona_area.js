'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('Persona','areaId',{
      type: Sequelize.INTEGER,
      allowNull:true
   })

   await queryInterface.addConstraint('Persona',{
    fields : ['areaId'],
    type : 'FOREIGN KEY',
    name : 'FK_PERSONA_AREA',
    references :{ 
      table : 'Area',
      field : 'id'
    }
  })


  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeConstraint('Persona','FK_PERSONA_AREA')
    await queryInterface.removeColumn('Persona','areaId')
    
  }
};
