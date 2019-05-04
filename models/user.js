'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  user.associate = function(models) {
    user.hasMany(models.note, {
    as: 'notes',
      foreignKey: 'userId',
    });
  };
  return user;
};