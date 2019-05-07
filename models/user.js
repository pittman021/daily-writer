'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    is_trialing: DataTypes.BOOLEAN,
    trial_end_date: DataTypes.DATE
  }, {});
  user.associate = function(models) {
    user.hasMany(models.note, {
    as: 'notes',
      foreignKey: 'userId',
    });
  };
  return user;
};