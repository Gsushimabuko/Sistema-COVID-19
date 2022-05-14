'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

   await queryInterface.bulkInsert('Area', [
      {nombre: 'Administrativo', createdAt: new Date(), updatedAt: new Date()},
      {nombre: 'Directivo', createdAt: new Date(), updatedAt: new Date()},
      {nombre: 'Dept. Salud', createdAt: new Date(), updatedAt: new Date()},
      {nombre: 'Docente', createdAt: new Date(), updatedAt: new Date()},
      {nombre: 'Mantenimiento', createdAt: new Date(), updatedAt: new Date()},
      {nombre: 'Vigilancia', createdAt: new Date(), updatedAt: new Date()}
   ]);

   await queryInterface.bulkInsert('Rol', [
    {username: 'directivo',password:'$2a$10$GmpKr2M2EC.JkaaN4Pupb.Gu64wJZ2poGanO8/jOFAyfc8Oz7mQam', createdAt: new Date(), updatedAt: new Date()},
    {username: 'sistema',password:'$2a$10$GmpKr2M2EC.JkaaN4Pupb.Gu64wJZ2poGanO8/jOFAyfc8Oz7mQam', createdAt: new Date(), updatedAt: new Date()},
    {username: 'salud',password:'$2a$10$GmpKr2M2EC.JkaaN4Pupb.Gu64wJZ2poGanO8/jOFAyfc8Oz7mQam', createdAt: new Date(), updatedAt: new Date()},
    {username: 'guardia',password:'$2a$10$GmpKr2M2EC.JkaaN4Pupb.Gu64wJZ2poGanO8/jOFAyfc8Oz7mQam', createdAt: new Date(), updatedAt: new Date()}
 ]);

   await queryInterface.bulkInsert('Grupo', [
    {nombre: '3 años A', createdAt: new Date(), updatedAt: new Date()},
    {nombre: '3 años B', createdAt: new Date(), updatedAt: new Date()},
    {nombre: '3 años C', createdAt: new Date(), updatedAt: new Date()},
    {nombre: '4 años A', createdAt: new Date(), updatedAt: new Date()},
    {nombre: '4 años B', createdAt: new Date(), updatedAt: new Date()},
    {nombre: '4 años C', createdAt: new Date(), updatedAt: new Date()},
    {nombre: '5 años A', createdAt: new Date(), updatedAt: new Date()},
    {nombre: '5 años B', createdAt: new Date(), updatedAt: new Date()},
    {nombre: '5 años C', createdAt: new Date(), updatedAt: new Date()},
    {nombre: '5 años D', createdAt: new Date(), updatedAt: new Date()},
    {nombre: '1er grado A',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '1er grado B',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '1er grado C',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '1er grado D',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '2do grado A',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '2do grado B',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '2do grado C',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '2do grado D',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '3er grado A',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '3er grado B',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '3er grado C',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '4to grado A',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '4to grado B',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '4to grado C',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '4to grado D',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '5to grado A',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '5to grado B',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '5to grado C',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '6to grado A',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '6to grado B',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '6to grado C',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '6to grado D',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '1er año A',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '1er año B',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '1er año C',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '1er año D',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '2do año A',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '2do año B',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '2do año C',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '2do año D',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '3er año A',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '3er año B',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '3er año C',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '4to año A',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '4to año B',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '4to año C',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '4to año D',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '5to año A',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '5to año B',createdAt: new Date(), updatedAt: new Date()},
    {nombre: '5to año C',createdAt: new Date(), updatedAt: new Date()}
  ]);
    
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Area', null, {});
    await queryInterface.bulkDelete('Grupo', null, {})
    await queryInterface.bulkDelete('Rol', null, {})
  }
};
