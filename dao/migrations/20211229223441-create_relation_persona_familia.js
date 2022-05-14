'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Persona','familiaId',{
      type: Sequelize.INTEGER,
      allowNull:true
   })
   

   await queryInterface.addConstraint('Persona',{
    fields : ['familiaId'],
    type : 'FOREIGN KEY',
    name : 'FK_PERSONA_FAMILIA',
    references :{ 
      table : 'Familia',
      field : 'id'
    }
   })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Persona','FK_PERSONA_FAMILIA')
    await queryInterface.removeColumn('Persona','familiaId')
  }
};
