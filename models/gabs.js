'use strict';
module.exports = function(sequelize, DataTypes) {
  var gabs = sequelize.define('gabs', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    contributor: DataTypes.STRING
  })
  gabs.associate = function(models) {
    gabs.belongsTo(models.users);
    gabs.hasMany(models.likes);
  }
  return gabs;
};