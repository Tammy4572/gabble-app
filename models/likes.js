'use strict';
module.exports = function(sequelize, DataTypes) {
  var likes = sequelize.define('likes', {
  })
  likes.associate = function (models) {
    likes.belongsTo(models.users);
    likes.belongsTo(models.gabs);
  }
  return likes;
};