const moment = require('moment');

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    try {
     await  queryInterface.addColumn('users', 'is_trialing', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      });
      await queryInterface.addColumn('users', 'trial_end_date', {
        type: Sequelize.DATE,
        defaultValue: moment().add('14', 'days')
      });
      return Promise.resolve();
    } catch(e) {
      return Promise.reject(e);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      queryInterface.removeColumn('users', 'trial_end_date');
      queryInterface.removeColumn('users', 'is_trialing');
      return Promise.resolve();
    } catch(e) {
      return Promise.reject(e);
    }
  }
};
