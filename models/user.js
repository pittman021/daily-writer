'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    is_trialing: DataTypes.BOOLEAN,
    stripe_customer_id: DataTypes.STRING,
    trial_end_date: DataTypes.DATE,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpires: DataTypes.DATE
  }, {});
  user.associate = function(models) {
    user.hasMany(models.note, {
    as: 'notes',
      foreignKey: 'userId',
    });
  };
  return user;
};