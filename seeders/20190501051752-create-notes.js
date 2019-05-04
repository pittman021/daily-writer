const moment = require('moment');

'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    var note = {
      id: 1,
      userId: 1,
      content: 'hello this is the best thing ever',
      word_count: 7,
      createdAt: new Date(2019,4,2),
      updatedAt: new Date(2019,4,2)
    };

    var note2 = {
      id: 2,
      userId: 1,
      content: 'this is todays note!',
      word_count: 4,
      createdAt: new Date(2019,4,3),
      updatedAt: new Date(2019,4,3)
    };

    var newArray = [];

    newArray.push(note);
    newArray.push(note2);

    console.log(`created new note`);

    return queryInterface.bulkInsert('notes', newArray, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('notes', null, {})
  }
};
