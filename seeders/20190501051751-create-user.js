const moment = require('moment');
const bCrypt = require('bcrypt-nodejs');

'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    var generateHash = function(password) {
      return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
    };

    const userPassword = generateHash('pass');

    var today = new Date();

    var arr = [];
    var user = {
      id: 1,
      email: 'tim.pittman021@gmail.com',
      password: userPassword,
      is_trialing: true,
      trial_end_date: moment(today, "YYYY-MM-DD HH:mm:ss").subtract(5, 'days').toISOString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    arr.push(user);

    console.log(`created ${user.email}`)

    return queryInterface.bulkInsert('users', arr, {});
 
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {})
  }
};
