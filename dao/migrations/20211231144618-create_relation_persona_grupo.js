'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    

      await queryInterface.addColumn('Persona','grupoId',{
        type: Sequelize.INTEGER,
        allowNull:true
     })
  
     await queryInterface.addConstraint('Persona',{
      fields : ['grupoId'],
      type : 'FOREIGN KEY',
      name : 'FK_PERSONA_GRUPO',
      references :{ 
        table : 'Grupo',
        field : 'id'
      }
    })

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeConstraint('Persona','FK_PERSONA_GRUPO')
    await queryInterface.removeColumn('Persona','grupoId')

  }
};
