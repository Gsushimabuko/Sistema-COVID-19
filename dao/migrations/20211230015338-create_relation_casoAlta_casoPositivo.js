'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.addColumn('CasoAlta','casoPositivoId',{
      type: Sequelize.INTEGER,
      allowNull:true
   })

   await queryInterface.addConstraint('CasoAlta',{
    fields : ['casoPositivoId'],
    type : 'FOREIGN KEY',
    name : 'FK_CASOALTA_CASOPOSITIVO',
    references :{ 
      table : 'CasoPositivo',
      field : 'id'
    }
  })

  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.removeConstraint('CasoAlta','FK_CASOALTA_CASOPOSITIVO')
    await queryInterface.removeColumn('CasoAlta','casoPositivoId')

  }
};
