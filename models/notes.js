'use strict';
module.exports = (sequelize, DataTypes) => {
  const note = sequelize.define('note', {
    content: DataTypes.TEXT,
    word_count: DataTypes.NUMBER
  }, {});
  note.associate = function(models) {
  };
  return note;
};

