'use strict';
module.exports = (sequelize, DataTypes) => {
  const subscription = sequelize.define('subscription', {
    token: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  subscription.associate = function(models) {
    subscription.belongsTo(models.user, {
      as: 'subscription',
      foreignKey: 'userId'
    });
  };
  return subscription;
};