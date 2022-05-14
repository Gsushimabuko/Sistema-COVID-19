'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.addColumn('Caso','fichaId',{
      type: Sequelize.INTEGER,
      allowNull:true
   })

   await queryInterface.addConstraint('Caso',{
    fields : ['fichaId'],
    type : 'FOREIGN KEY',
    name : 'FK_CASO_FICHA',
    references :{ 
      table : 'Ficha',
      field : 'id'
    }
  })

  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.removeConstraint('Caso','FK_CASO_FICHA')
    await queryInterface.removeColumn('Caso','fichaId')
    
  }
};
