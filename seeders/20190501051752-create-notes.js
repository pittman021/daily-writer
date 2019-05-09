'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    var arr = [];
    for (var i = 0; i < 8; i++) {
      var note = {
        userId: 1,
        content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)',
        word_count: 104,
        createdAt: new Date(2019,4,i),
        updatedAt: new Date(2019,4,i)
      };
      arr.push(note);
      console.log('created new note!');
    }

  
    console.log(`created new note`);

    return queryInterface.bulkInsert('notes', arr, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('notes', null, {})
  }
};
