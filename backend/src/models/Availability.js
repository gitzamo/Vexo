const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Availability extends Model {}

Availability.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    day_of_week: {
      // 0 = Sunday ... 6 = Saturday
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0, max: 6 },
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Availability',
    tableName: 'availabilities',
  }
);

module.exports = Availability;
