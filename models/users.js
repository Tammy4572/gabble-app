'use strict';
module.exports = function(sequelize, DataTypes) {
  var users = sequelize.define('users', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  })
  users.associate = function(models) {
    users.hasMany(models.gabs);
    users.hasMany(models.likes);
  }
  return users;
};